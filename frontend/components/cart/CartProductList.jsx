"use client";

import {
  useDecreaseCartMutation,
  useDeleteCartMutation,
  useIncreaseCartMutation,
  useMyCartQuery,
} from "@/feature/customer/CartApi";
import { useCreateOrderMutation } from "@/feature/customer/OrderApi";
import Cookies from "js-cookie";
import {
  CheckCircle,
  CheckCircle2,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

/* -------------------------------------------------------
    COOKIE HELPERS
-------------------------------------------------------- */

// Get selected IDs from cookie
const getSelected = () => {
  try {
    return JSON.parse(Cookies.get("selectedProducts") || "[]");
  } catch {
    return [];
  }
};

// Save selected IDs to cookie
const saveSelected = (ids) => {
  Cookies.set("selectedProducts", JSON.stringify(ids), {
    expires: 7,
    sameSite: "Lax",
  });
};

// Toggle a selected ID
const toggleSelected = (id) => {
  const selected = getSelected();
  const exists = selected.includes(id);

  const updated = exists ? selected.filter((x) => x !== id) : [...selected, id];

  saveSelected(updated);
  return updated;
};

// Clear selection
const clearSelected = () => {
  saveSelected([]);
  return [];
};

// Select all items
const selectAll = (allCartItems) => {
  const ids = [];
  allCartItems.forEach((sellerGroup) => {
    sellerGroup.items.forEach((item) => {
      ids.push(item.cartId);
    });
  });
  saveSelected(ids);
  return ids;
};

export default function CombinedCartCheckoutPage() {
  const router = useRouter();
  const { data } = useSession();
  const id = data?.user?.id;
  const [createOrder, { isLoading: orderLoading, isError, error }] =
    useCreateOrderMutation();
  const { t } = useTranslation('cart');

  const { data: cartData, isLoading } = useMyCartQuery(id);
  const [increaseCart] = useIncreaseCartMutation();
  const [decreaseCart] = useDecreaseCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  const groupedCartItems = cartData?.data?.groupedBySeller || [];

  /* -------------------------------------------------------
      LOCAL STATE FOR COOKIE SELECTED ITEMS
  -------------------------------------------------------- */
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  /* -------------------------------------------------------
      CHECKOUT FORM STATE
  -------------------------------------------------------- */
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "card", // only 'card' now
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    billingCity: "",
    sameAsShipping: true,
  });

  // Calculate total items count for select all
  const totalItemsCount = groupedCartItems.reduce((acc, sellerGroup) => {
    return acc + sellerGroup.items.length;
  }, 0);

  useEffect(() => {
    queueMicrotask(() => {
      const cookieSelected = getSelected();
      setSelectedProducts(cookieSelected);
    });
  }, [groupedCartItems]);

  /* -------------------------------------------------------
      HANDLERS
  -------------------------------------------------------- */

  const handleSelect = (cartId) => {
    const updated = toggleSelected(cartId);
    setSelectedProducts(updated);
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === totalItemsCount && totalItemsCount > 0) {
      setSelectedProducts(clearSelected());
    } else {
      setSelectedProducts(selectAll(groupedCartItems));
    }
  };

  const handleIncrease = async (cartId) => {
    try {
      await increaseCart(cartId);
    } catch (error) {
      console.error("Increase error:", error);
    }
  };

  const handleDecrease = async (cartItem) => {
    try {
      if (cartItem.quantity === 1) {
        toast.error(t('decreaseBelowOne'));
      } else {
        await decreaseCart(cartItem.cartId);
      }
    } catch (error) {
      console.error("Decrease error:", error);
    }
  };

  const handleDelete = async (cartId) => {
    try {
      await deleteCart(cartId);

      // remove from cookie selection
      const updated = selectedProducts.filter((id) => id !== cartId);
      saveSelected(updated);
      setSelectedProducts(updated);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* -------------------------------------------------------
      CHECKOUT HANDLERS
  -------------------------------------------------------- */

  const handleCheckoutInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCheckoutData({
      ...checkoutData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleProceedToCheckout = () => {
    if (selectedProducts.length === 0) {
      toast.error(t('selectAtLeastOne'));
      return;
    }
    setShowCheckout(true);
  };

  if (isError) {
    console.log(error?.data?.message, "Kire mamur beta");
    toast.error(error?.data?.message);
  }

  const handleConfirmAndPay = async () => {
    // Validate required fields
    if (
      !checkoutData.fullName ||
      !checkoutData.email ||
      !checkoutData.phone ||
      !checkoutData.address ||
      !checkoutData.city ||
      !checkoutData.country
    ) {
      toast.error(t('fillRequiredFields'));
      return;
    }

    // Validate card details
    if (
      !checkoutData.cardNumber ||
      !checkoutData.expiryDate ||
      !checkoutData.cvv ||
      !checkoutData.cardHolderName
    ) {
      toast.error(t('fillCardDetails'));
      return;
    }

    try {
      // Get all selected items from all sellers
      const selectedCartItems = [];
      const productIds = [];

      groupedCartItems.forEach((sellerGroup) => {
        sellerGroup.items.forEach((item) => {
          if (selectedProducts.includes(item.cartId)) {
            selectedCartItems.push(item);
            productIds.push(item.product._id);
          }
        });
      });

      if (selectedCartItems.length === 0) {
        toast.error(t('noItemsSelected'));
        return;
      }

      // Prepare order data
      const orderData = {
        userId: id,
        cartIds: selectedProducts,
        productIds: productIds,

        address: {
          street: checkoutData.address,
          city: checkoutData.city,
          state: checkoutData.state,
          postalCode: checkoutData.postalCode,
          country: checkoutData.country,
        },

        shippingInfo: {
          fullName: checkoutData.fullName,
          email: checkoutData.email,
          phone: checkoutData.phone,
        },

        paymentMethod: checkoutData.paymentMethod,

        // Order summary
        itemCount: selectedCartItems.length,
        subtotal: subtotal,
        shipping: shipping,
        totalAmount: finalTotal,

        paymentStatus: "paid",

        // Add individual item details
        items: selectedCartItems.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),

        cardDetails: {
          last4: checkoutData.cardNumber.slice(-4),
          expiry: checkoutData.expiryDate,
          holderName: checkoutData.cardHolderName,
        },
      };

      console.log("Order Data:", orderData);

      // Call API
      const result = await createOrder(orderData).unwrap();

      console.log("Order Result:", result);

      if (result?.checkoutUrl) {
        window.location.href = result?.checkoutUrl;
        clearSelected();
      }

      if (result.message === "Order placed successfully") {
        toast.success("Order placed successfully");
        setOrderSuccess(true);

        // Clear selected items after successful order
        clearSelected();
        setSelectedProducts([]);
      } else {
        toast.error(result.message || "Failed to create order");
      }
    } catch (error) {
      console.log("Order creation error:", error);
      toast.error(error?.data?.message || t('somethingWentWrong'));
    }
  };

  const handleContinueShopping = () => {
    router.push("/marketplace");
  };

  const handleViewOrders = () => {
    router.push("/orders");
  };

  /* -------------------------------------------------------
      CALCULATIONS
  -------------------------------------------------------- */
  // Get all selected items from all sellers
  const selectedItems = [];
  groupedCartItems.forEach((sellerGroup) => {
    sellerGroup.items.forEach((item) => {
      if (selectedProducts.includes(item.cartId)) {
        selectedItems.push(item);
      }
    });
  });

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = selectedItems.length > 0 ? 0 : 0;
  const finalTotal = subtotal + shipping;

  /* -------------------------------------------------------
      STEPPER CONFIGURATION
  -------------------------------------------------------- */
  const steps = [
    {
      id: 1,
      name: t('cart'),
      icon: ShoppingCart,
      active: !showCheckout && !orderSuccess,
      completed: showCheckout || orderSuccess,
    },
    {
      id: 2,
      name: t('checkout'),
      icon: CreditCard,
      active: showCheckout && !orderSuccess,
      completed: orderSuccess,
    },
    {
      id: 3,
      name: t('confirmation'),
      icon: CheckCircle,
      active: orderSuccess,
      completed: false,
    },
  ];

  /* -------------------------------------------------------
      LOADING & EMPTY STATE
  -------------------------------------------------------- */

  if (isLoading) {
    return (
      <section className='w-full bg-[#F5F5FA] py-8 px-5 text-center'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4'></div>
          <div className='h-4 bg-gray-300 rounded w-1/2 mx-auto'></div>
        </div>
      </section>
    );
  }

  if (!groupedCartItems.length && !showCheckout && !orderSuccess) {
    return (
      <section className='w-full bg-[#F5F5FA] min-h-[60vh] flex flex-col items-center justify-center px-5 text-center'>
        <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6'>
          <ShoppingCart className='w-12 h-12 text-gray-400' />
        </div>
        <h3 className='text-2xl font-semibold text-gray-800 mb-3'>
          {t('cartEmpty')}
        </h3>
        <p className='text-gray-600 mb-8 max-w-md'>
          {t('cartEmptyMessage')}
        </p>
        <button
          onClick={() => router.push("/marketplace")}
          className='px-8 py-3 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium hover:opacity-90 transition-all'>
          {t('browseProducts')}
        </button>
      </section>
    );
  }

  /* -------------------------------------------------------
      MAIN UI
  -------------------------------------------------------- */

  return (
    <div>
      {/* STEPPER SECTION */}
      <section>
        <div className='w-full bg-white py-10 px-6'>
          <div className='max-w-[1300px] mx-auto'>
            {/* STEPPER */}
            <div className='flex items-center justify-center gap-4 md:gap-10'>
              {steps.map((step, index) => (
                <div key={step.id} className='flex items-center'>
                  {/* STEP CIRCLE */}
                  <div className='flex items-center gap-3'>
                    <div
                      className={`
                        w-[38px] h-[38px] rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${
                          step.active || step.completed
                            ? "bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_3px_10px_rgba(0,0,0,0.15)]"
                            : "bg-[#F1F1F1] border border-[#E0E0E0]"
                        }
                      `}>
                      <step.icon
                        size={18}
                        className={`${
                          step.active || step.completed
                            ? "text-white"
                            : "text-[#7B7B7B]"
                        }`}
                      />
                    </div>

                    {/* STEP NAME */}
                    <span
                      className={`
                        text-[15px] font-medium transition-all duration-300 hidden md:block
                        ${
                          step.active || step.completed
                            ? "text-[#1B1B1B]"
                            : "text-[#7B7B7B]"
                        }
                      `}>
                      {step.name}
                    </span>
                  </div>

                  {/* CONNECTOR LINE (not after last step) */}
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-[40px] md:w-[80px] h-[2px] mx-2 md:mx-4 transition-all duration-300
                        ${
                          step.completed
                            ? "bg-gradient-to-r from-[#9838E1] to-[#F68E44]"
                            : "bg-[#E3E3E3]"
                        }
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className='w-full bg-[#F7F7FA] py-10 px-4'>
        <Toaster />

        {/* CART VIEW */}
        {!showCheckout && !orderSuccess && (
          <div className='max-w-[1300px] mx-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-2xl font-bold text-gray-800'>
                {t('yourCart')}
              </h1>
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedProducts.length === 0}
                className='px-6 py-2 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium disabled:opacity-40 hover:opacity-90 transition-all cursor-pointer'>
                {t('proceedToCheckout')} ({selectedProducts.length})
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* LEFT SIDE - PRODUCTS */}
              <div className='lg:col-span-2'>
                <div className='flex items-center justify-between text-sm text-gray-700 mb-4 pl-1'>
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      onChange={handleSelectAll}
                      checked={
                        selectedProducts.length === totalItemsCount &&
                        totalItemsCount > 0
                      }
                      className='w-4 h-4 accent-[#9838E1] cursor-pointer'
                    />
                    <span>{t('selectAll')} ({totalItemsCount} {t('items')})</span>
                  </div>
                </div>

                {/* GROUPED BY SELLER */}
                <div className='space-y-6'>
                  {groupedCartItems.map((sellerGroup) => (
                    <div
                      key={sellerGroup._id}
                      className='bg-white rounded-xl shadow-sm border border-[#EDEAF4] overflow-hidden'>
                      {/* Seller Header */}
                      <div className='bg-gray-50 px-5 py-4 border-b'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full overflow-hidden border'>
                            <img
                              src={sellerGroup.seller.shopLogo}
                              alt={sellerGroup.seller.shopName}
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div>
                            <div className='flex items-center gap-2'>
                              <Store size={16} className='text-gray-500' />
                              <span className='font-semibold text-gray-800'>
                                {sellerGroup.seller.shopName}
                              </span>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>
                              {t('soldBy')}: {sellerGroup.seller.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Seller's Products */}
                      <div className='p-5 space-y-4'>
                        {sellerGroup.items.map((item) => (
                          <div
                            key={item.cartId}
                            className='flex items-start gap-5 pb-4 border-b last:border-0 last:pb-0'>
                            {/* Checkbox */}
                            <input
                              type='checkbox'
                              checked={selectedProducts.includes(item.cartId)}
                              onChange={() => handleSelect(item.cartId)}
                              className='mt-2 w-5 h-5 accent-[#9838E1] cursor-pointer'
                            />

                            {/* Product Image */}
                            <div className='w-[130px] h-[120px] rounded-lg overflow-hidden border'>
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className='w-full h-full object-cover'
                              />
                            </div>

                            {/* Product Info */}
                            <div className='flex-grow'>
                              <h3 className='font-semibold text-lg'>
                                {item.product.name}
                              </h3>

                              <p className='text-sm text-gray-600 mt-1'>
                                <span className='font-medium'>{t('category')}:</span>{" "}
                                {item.product.category}
                              </p>

                              <div className='flex items-center gap-3 text-sm text-gray-600 mt-1'>
                                <MapPin size={15} />
                                {item.product.location}
                              </div>

                              <div className='flex items-center gap-1 mt-2 text-yellow-500'>
                                <Star
                                  size={16}
                                  fill='#FFC107'
                                  stroke='#FFC107'
                                />
                                <span className='text-gray-700 text-sm'>
                                  {item?.product?.rating?.toFixed(1)} (0 {t('reviews')})
                                </span>
                              </div>

                              <p className='mt-2 text-[20px] font-semibold text-[#F78D25]'>
                                ${item.product.price}
                              </p>

                              <div className='flex items-center gap-6 mt-3'>
                                <div className='flex items-center border border-gray-300 rounded-lg'>
                                  <button
                                    onClick={() => handleDecrease(item)}
                                    className='w-10 h-10 text-lg hover:bg-gray-100 transition-colors cursor-pointer'
                                    disabled={item.quantity <= 1}>
                                    −
                                  </button>
                                  <span className='w-12 text-center font-medium'>
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleIncrease(item.cartId)}
                                    className='w-10 h-10 text-lg hover:bg-gray-100 transition-colors cursor-pointer'>
                                    +
                                  </button>
                                </div>

                                <span className='text-sm text-gray-700'>
                                  {t('subtotal')}:{" "}
                                  <b className='text-[#F78D25]'>
                                    $
                                    {(
                                      item.product.price * item.quantity
                                    ).toFixed(2)}
                                  </b>
                                </span>
                              </div>
                            </div>

                            {/* Delete */}
                            <div className='flex flex-col items-end gap-3'>
                              <button
                                onClick={() => handleDelete(item.cartId)}
                                className='cursor-pointer hover:bg-gray-100 p-1 rounded'>
                                <X
                                  size={18}
                                  className='text-gray-500 hover:text-red-500'
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE - SUMMARY */}
              <div className='bg-white rounded-xl shadow p-6 h-max sticky top-20'>
                <h3 className='text-lg font-semibold mb-6'>{t('orderSummary')}</h3>

                {/* Selected Products Preview */}
                <div className='space-y-5 mb-6 max-h-60 overflow-y-auto'>
                  {selectedItems.map((item) => (
                    <div
                      key={item.cartId}
                      className='flex items-center justify-between pb-3 border-b last:border-0'>
                      <div className='flex items-center gap-4'>
                        <div className='w-[60px] h-[60px] rounded-lg overflow-hidden border'>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className='w-full h-full object-cover'
                          />
                        </div>

                        <div>
                          <p className='font-medium text-sm line-clamp-1'>
                            {item.product.name}
                          </p>
                          <p className='text-gray-500 text-xs'>
                            <span className='font-medium'>
                              {item.product.seller?.shopName || t('unknownShop')}
                            </span>
                          </p>
                          <p className='text-gray-500 text-xs'>
                            {t('quantity')}:{" "}
                            <span className='font-medium'>
                              x{item.quantity}
                            </span>
                          </p>
                        </div>
                      </div>

                      <p className='text-[#F78D25] font-semibold'>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedItems.length === 0 && (
                  <div className='text-center py-4 text-gray-500'>
                    No items selected
                  </div>
                )}

                <hr className='my-4 border-gray-300' />

                <div className='space-y-3 text-sm text-gray-700'>
                  <div className='flex justify-between'>
                    <span>{t('subtotal')}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>{t('shipping')}</span>
                    <span>
                      {shipping === 0 ? t('free') : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <hr className='my-2 border-gray-300' />
                  <div className='flex justify-between text-lg font-semibold text-[#F78D25]'>
                    <span>{t('total')}</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={selectedProducts.length === 0}
                  className='w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium disabled:opacity-40 hover:opacity-90 transition-all cursor-pointer'>
                  {t('proceedToCheckout')} ({selectedProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHECKOUT VIEW */}
        {showCheckout && !orderSuccess && (
          <div className='max-w-[1200px] mx-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-2xl font-bold text-gray-800'>{t('checkout')}</h1>
              <button
                onClick={() => setShowCheckout(false)}
                className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer'>
                {t('backToCart')}
              </button>
            </div>

            <div className='grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)]'>
              {/* LEFT SIDE – SHIPPING + PAYMENT */}
              <div className='space-y-6'>
                {/* SHIPPING DETAILS */}
                <div className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5'>
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]'>
                      <MapPin className='h-4 w-4 text-[#9B51E0]' />
                    </span>
                    <h3 className='text-[14px] font-semibold text-[#222]'>
                      {t('shippingDetails')}
                    </h3>
                  </div>

                  <div className='space-y-4 text-[12px]'>
                    {/* Full name */}
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        {t('fullName')}*
                      </label>
                      <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                        <User className='h-4 w-4 text-[#C2B7EB]' />
                        <input
                          name='fullName'
                          value={checkoutData.fullName}
                          onChange={handleCheckoutInputChange}
                          className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder={t('fullName')}
                        />
                      </div>
                    </div>

                    {/* Email + Phone */}
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('email')}*
                        </label>
                        <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                          <Mail className='h-4 w-4 text-[#C2B7EB]' />
                          <input
                            name='email'
                            type='email'
                            value={checkoutData.email}
                            onChange={handleCheckoutInputChange}
                            className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                            placeholder='youremail@example.com'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('telephone')}*
                        </label>
                        <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                          <Phone className='h-4 w-4 text-[#C2B7EB]' />
                          <input
                            name='phone'
                            value={checkoutData.phone}
                            onChange={handleCheckoutInputChange}
                            className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                            placeholder='+880'
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        {t('address')}*
                      </label>
                      <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                        <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                        <input
                          name='address'
                          value={checkoutData.address}
                          onChange={handleCheckoutInputChange}
                          className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder={t('streetCityRegion')}
                        />
                      </div>
                    </div>

                    {/* Country + City */}
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('country')}*
                        </label>
                        <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                          <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                          <input
                            name='country'
                            value={checkoutData.country}
                            onChange={handleCheckoutInputChange}
                            className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                            placeholder={t('enterCountry')}
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('city')}*
                        </label>
                        <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                          <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                          <input
                            name='city'
                            value={checkoutData.city}
                            onChange={handleCheckoutInputChange}
                            className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                            placeholder={t('enterCity')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* State + Postal Code */}
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('stateProvince')}
                        </label>
                        <input
                          name='state'
                          value={checkoutData.state}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder={t('stateOrProvince')}
                        />
                      </div>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('postalCode')}
                        </label>
                        <input
                          name='postalCode'
                          value={checkoutData.postalCode}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder={t('postalCode')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD - Card Only */}
                <div className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5'>
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]'>
                      <CreditCard className='h-4 w-4 text-[#9B51E0]' />
                    </span>
                    <h3 className='text-[14px] font-semibold text-[#222]'>
                      {t('paymentMethod')}
                    </h3>
                  </div>

                  {/* Only Card Method */}
                  <div className='space-y-3 text-[12px] mb-4'>
                    <div className='rounded-[10px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] p-[1px]'>
                      <div className='flex items-center justify-between rounded-[9px] bg-[#FAF7FF] px-3 py-[9px]'>
                        <div className='flex items-center gap-2'>
                          <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-white'>
                            <CreditCard className='h-3.5 w-3.5 text-[#9B51E0]' />
                          </span>
                          <div>
                            <p className='text-[12px] font-semibold text-[#4A4A4A]'>
                              {t('creditDebitCard')}
                            </p>
                            <p className='text-[11px] text-[#9B51E0]'>
                              {t('visaMastercardAmex')}
                            </p>
                          </div>
                        </div>
                        <span className='h-[14px] w-[14px] rounded-full border-2 border-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_0_0_2px_rgba(152,56,225,0.25)]' />
                      </div>
                    </div>
                  </div>

                  {/* Card fields - Always shown since only card payment */}
                  <div className='space-y-3 text-[12px]'>
                    {/* Card number */}
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        {t('cardNumber')}*
                      </label>
                      <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                        <CreditCard className='h-4 w-4 text-[#C2B7EB]' />
                        <input
                          name='cardNumber'
                          value={checkoutData.cardNumber}
                          onChange={handleCheckoutInputChange}
                          className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder='2950 1533 8297 8890'
                        />
                      </div>
                    </div>

                    {/* Expiration + CVV */}
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('expirationDate')}*
                        </label>
                        <input
                          name='expiryDate'
                          value={checkoutData.expiryDate}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder={t('mmYy')}
                        />
                      </div>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('cvv')}*
                        </label>
                        <input
                          name='cvv'
                          value={checkoutData.cvv}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder='•••'
                        />
                      </div>
                    </div>

                    {/* Name + City select */}
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('nameOfHolder')}*
                        </label>
                        <input
                          name='cardHolderName'
                          value={checkoutData.cardHolderName}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder={t('nameOnCard')}
                        />
                      </div>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          {t('billingCity')}*
                        </label>
                        <input
                          name='billingCity'
                          value={checkoutData.billingCity}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder={t('enterCity')}
                        />
                      </div>
                    </div>

                    {/* Stripe note + checkbox */}
                    <div className='mt-3 space-y-2'>
                      <div className='flex items-start gap-2 text-[11px] text-[#7F7F90]'>
                        <ShieldCheck className='mt-[1px] h-4 w-4 text-[#52B788]' />
                        <p>
                          {t('paymentProtected')}, <br />
                          <span className='text-[#9B51E0]'>
                            {t('encryption')}
                          </span>
                          .
                        </p>
                      </div>

                      <label className='flex items-center gap-2 text-[11px] text-[#7F7F90]'>
                        <input
                          type='checkbox'
                          name='sameAsShipping'
                          checked={checkoutData.sameAsShipping}
                          onChange={handleCheckoutInputChange}
                          className='h-[12px] w-[12px]'
                        />
                        {t('sameBillingAddress')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE – ORDER SUMMARY */}
              <aside className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5 h-fit sticky top-20'>
                <h3 className='text-[14px] font-semibold text-[#222] mb-4'>
                  {t('orderSummary')}
                </h3>

                {/* Items */}
                <div className='space-y-3 text-[12px] mb-4 max-h-60 overflow-y-auto'>
                  {selectedItems.map((item) => (
                    <div
                      key={item.cartId}
                      className='flex items-center justify-between gap-3 pb-3 border-b border-[#F1ECF8]'>
                      <div className='flex items-center gap-3'>
                        <div className='h-[42px] w-[42px] overflow-hidden rounded-[10px] bg-[#F2F2F7]'>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='text-[12px] font-semibold text-[#333] line-clamp-1'>
                            {item.product.name}
                          </p>
                          <p className='text-[11px] text-[#9B9B9B]'>
                            {item.product.seller?.shopName || t('unknownShop')}
                          </p>
                          <p className='text-[11px] text-[#9B9B9B]'>
                            {t('quantity')}: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className='text-[12px] font-semibold text-[#F78D25]'>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedItems.length === 0 && (
                  <div className='text-center py-4 text-gray-400 text-sm'>
                    No items selected
                  </div>
                )}

                {/* Totals */}
                <div className='space-y-1 text-[11px] text-[#777] mb-4'>
                  <div className='flex justify-between'>
                    <span>{t('subtotal')}</span>
                    <span className='text-[#333]'>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>{t('shipment')}</span>
                    <span className='text-[#333]'>
                      {" "}
                      {shipping === 0 ? t('free') : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className='flex justify-between items-center text-[12px] font-semibold text-[#333] mb-4'>
                  <span>{t('total')}</span>
                  <span className='text-[#F78D25]'>
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Confirm button */}
                <button
                  onClick={handleConfirmAndPay}
                  disabled={orderLoading || selectedItems.length === 0}
                  className='flex w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] py-[10px] text-[13px] font-medium text-white shadow-[0_4px_16px_rgba(0,0,0,0.20)] mb-3 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all'>
                  <Lock className='h-4 w-4' />
                  {orderLoading ? t('processing') : t('confirmAndPay')}
                </button>

                {/* Security line */}
                <div className='flex items-center justify-center gap-2 mb-3'>
                  <CheckCircle2 className='h-4 w-4 text-[#52B788]' />
                  <p className='text-[11px] text-[#777]'>
                    {t('securePayment')}
                  </p>
                </div>

                {/* Payment methods */}
                <div className='flex border-t border-[#F1ECF8] justify-center w-full'>
                  <div className='pt-3'>
                    <p className='text-[11px] text-[#999] mb-2'>
                      {t('acceptedPaymentMethods')}
                    </p>
                    <div className='flex gap-2'>
                      <span className='inline-flex items-center justify-center rounded-[4px] bg-[#1A1F71] px-2 py-[2px] text-[10px] font-semibold text-white'>
                        {t('visa')}
                      </span>
                      <span className='inline-flex items-center justify-center rounded-[4px] bg-[#EB001B] px-2 py-[2px] text-[10px] font-semibold text-white'>
                        {t('mc')}
                      </span>
                      <span className='inline-flex items-center justify-center rounded-[4px] bg-[#F79E1B] px-2 py-[2px] text-[10px] font-semibold text-white'>
                        {t('amex')}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* ORDER CONFIRMATION VIEW */}
        {orderSuccess && (
          <div className='max-w-[900px] mx-auto'>
            <div className='bg-white rounded-[20px] border border-[#ECE6F7] shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-8 md:p-12 text-center'>
              {/* Success Icon */}
              <div className='w-[100px] h-[100px] mx-auto rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] flex items-center justify-center mb-6 shadow-lg'>
                <CheckCircle className='h-16 w-16 text-white' />
              </div>

              {/* Success Message */}
              <h1 className='text-3xl font-bold text-[#1B1B1B] mb-4'>
                {t('orderConfirmed')}
              </h1>
              <p className='text-gray-600 text-lg mb-2'>
                {t('thankYouPurchase')}
              </p>
              <p className='text-gray-500 mb-8'>
                {t('orderSuccessMessage')}
              </p>

              {/* Order Summary */}
              <div className='bg-[#F9F7FF] rounded-[14px] p-6 mb-8 max-w-[500px] mx-auto'>
                <h3 className='text-lg font-semibold text-[#1B1B1B] mb-4'>
                  {t('orderSummary')}
                </h3>
                <div className='space-y-3 text-left'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>{t('itemsCount')}:</span>
                    <span className='font-medium'>{selectedItems.length}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>{t('subtotal')}:</span>
                    <span className='font-medium'>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>{t('shipping')}:</span>
                    <span className='font-medium'>
                      {shipping === 0 ? t('free') : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className='border-t border-gray-300 pt-3 mt-2'>
                    <div className='flex justify-between'>
                      <span className='text-lg font-semibold'>{t('total')}:</span>
                      <span className='text-lg font-bold text-[#F78D25]'>
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className='mb-8'>
                <p className='text-gray-600 mb-2'>
                  {t('paymentMethod')}:{" "}
                  <span className='font-semibold capitalize'>
                    {t('creditDebitCard')}
                  </span>
                </p>
                <p className='text-gray-500 text-sm'>
                  {t('paymentProcessed')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={handleContinueShopping}
                  className='px-8 py-3 rounded-lg border-2 border-[#9838E1] text-[#9838E1] font-medium hover:bg-[#9838E1] hover:text-white transition-colors cursor-pointer'>
                  {t('continueShopping')}
                </button>
                <button
                  onClick={handleViewOrders}
                  className='px-8 py-3 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium hover:opacity-90 transition cursor-pointer'>
                  {t('viewMyOrders')}
                </button>
              </div>

              {/* Additional Info */}
              <div className='mt-10 pt-6 border-t border-gray-200'>
                <p className='text-gray-500 text-sm'>
                  {t('confirmationEmail')}{" "}
                  <span className='font-medium'>{checkoutData.email}</span>
                </p>
                <p className='text-gray-400 text-xs mt-2'>
                  {t('orderId')}: #ORD-{Date.now().toString().slice(-8)}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}