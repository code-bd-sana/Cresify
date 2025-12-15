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
  CheckCircle2,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
const selectAll = (cartItems) => {
  const ids = cartItems.map((item) => item._id);
  saveSelected(ids);
  return ids;
};

export default function CombinedCartCheckoutPage() {
  const { data } = useSession();
  const id = data?.user?.id;
  const [createOrder, { isLoading: orderLoading, isError, error }] =
    useCreateOrderMutation();

  const { data: cartData, isLoading } = useMyCartQuery(id);
  const [increaseCart] = useIncreaseCartMutation();
  const [decreaseCart] = useDecreaseCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  const cartItems = cartData?.data || [];

  /* -------------------------------------------------------
      LOCAL STATE FOR COOKIE SELECTED ITEMS
  -------------------------------------------------------- */
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

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
    paymentMethod: "card", // 'card' or 'cod'
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    billingCity: "",
    sameAsShipping: true,
  });

  useEffect(() => {
    queueMicrotask(() => {
      const cookieSelected = getSelected();
      setSelectedProducts(cookieSelected);
    });
  }, [cartItems]);

  /* -------------------------------------------------------
      HANDLERS
  -------------------------------------------------------- */

  const handleSelect = (cartId) => {
    const updated = toggleSelected(cartId);
    setSelectedProducts(updated);
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === cartItems.length) {
      setSelectedProducts(clearSelected());
    } else {
      setSelectedProducts(selectAll(cartItems));
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
      if (cartItem.count === 1) {
        toast.error("Cannot decrease below 1");
      } else {
        await decreaseCart(cartItem._id);
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

  const handlePaymentMethodChange = (method) => {
    setCheckoutData({
      ...checkoutData,
      paymentMethod: method,
    });
  };

  const handleProceedToCheckout = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
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
      toast.error("Please fill in all required shipping fields");
      return;
    }

    if (checkoutData.paymentMethod === "card") {
      if (
        !checkoutData.cardNumber ||
        !checkoutData.expiryDate ||
        !checkoutData.cvv ||
        !checkoutData.cardHolderName
      ) {
        toast.error("Please fill in all card details");
        return;
      }
    }

    try {
      // Get selected cart items
      const selectedCartItems = cartItems.filter((item) =>
        selectedProducts.includes(item._id)
      );

      if (selectedCartItems.length === 0) {
        toast.error("No items selected for checkout");
        return;
      }

      // Prepare order data
      const orderData = {
        userId: id,
        // Send cart IDs, not product IDs
        cartIds: selectedProducts, // This is the important fix
        // You can also send product IDs if needed
        productIds: selectedCartItems.map((item) => item.product._id),

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
        tax: tax,
        totalAmount: finalTotal,

        paymentStatus:
          checkoutData.paymentMethod === "cod" ? "pending" : "paid",

        // Add individual item details
        items: selectedCartItems.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.count,
          price: item.product.price,
          totalPrice: item.product.price * item.count,
        })),

        ...(checkoutData.paymentMethod === "card" && {
          cardDetails: {
            last4: checkoutData.cardNumber.slice(-4),
            expiry: checkoutData.expiryDate,
            holderName: checkoutData.cardHolderName,
          },
        }),
      };

      console.log("Order Data:", orderData);

      // Call API
      const result = await createOrder(orderData).unwrap();

      console.log("Order Result:", result);

      if (result.success) {
        toast.success("Order created successfully!");

        // Clear selected items after successful order
        clearSelected();
        setSelectedProducts([]);

        // Optionally redirect to order confirmation page
        // router.push(`/order-confirmation/${result.data.orderId}`);
      } else {
        toast.error(result.message || "Failed to create order");
      }
    } catch (error) {
      console.log("Order creation error:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  /* -------------------------------------------------------
      CALCULATIONS
  -------------------------------------------------------- */
  const selectedItems = cartItems.filter((item) =>
    selectedProducts.includes(item._id)
  );

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.product.price * item.count,
    0
  );
  const shipping = selectedItems.length > 0 ? 5 : 0;
  const tax = subtotal * 0.05;
  const finalTotal = subtotal + shipping + tax;

  /* -------------------------------------------------------
      LOADING & EMPTY STATE
  -------------------------------------------------------- */

  if (isLoading) {
    return (
      <section className='w-full bg-[#F5F5FA] py-8 px-5 text-center'>
        Loading cart...
      </section>
    );
  }

  if (!cartItems.length && !showCheckout) {
    return (
      <section className='w-full bg-[#F5F5FA] py-8 px-5 text-center'>
        <h3>Your cart is empty</h3>
        <button className='px-6 py-3 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium mt-4'>
          Browse Products
        </button>
      </section>
    );
  }

  /* -------------------------------------------------------
      MAIN UI
  -------------------------------------------------------- */

  return (
    <section className='w-full bg-[#F7F7FA] py-10 px-4'>
      <Toaster />
      {!showCheckout ? (
        /* -------------------------------------------------------
            CART VIEW
        -------------------------------------------------------- */
        <div className='max-w-[1300px] mx-auto'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-2xl font-bold text-gray-800'>Your Cart</h1>
            <button
              onClick={handleProceedToCheckout}
              disabled={selectedProducts.length === 0}
              className='px-6 py-2 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium disabled:opacity-40 cursor-pointer'>
              Proceed To Checkout ({selectedProducts.length})
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
                      selectedProducts.length === cartItems.length &&
                      cartItems.length > 0
                    }
                    className='w-4 h-4 accent-[#9838E1]'
                  />
                  <span>Select All ({cartItems.length} Items)</span>
                </div>
              </div>

              {/* PRODUCT LIST */}
              <div className='space-y-6'>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className='relative bg-white rounded-xl p-5 shadow-sm border border-[#EDEAF4] flex items-start gap-5'>
                    {/* Checkbox */}
                    <input
                      type='checkbox'
                      checked={selectedProducts.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                      className='mt-2 w-5 h-5 accent-[#9838E1]'
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

                      <p className='text-sm text-[#A46CFF] mt-1'>
                        by {item.product.seller.name || "Unknown Brand"}
                      </p>

                      <div className='flex items-center gap-3 text-sm text-gray-600 mt-1'>
                        <MapPin size={15} />
                        {item.product.location}
                      </div>

                      <div className='flex items-center gap-1 mt-2 text-yellow-500'>
                        <Star size={16} fill='#FFC107' stroke='#FFC107' />
                        <span className='text-gray-700 text-sm'>
                          4.6 (203 reviews)
                        </span>
                      </div>

                      <p className='mt-2 text-[20px] font-semibold text-[#F78D25]'>
                        ${item.product.price}
                      </p>

                      <div className='flex items-center gap-6 mt-3'>
                        <div className='flex items-center border border-gray-300 rounded-lg'>
                          <button
                            onClick={() => handleDecrease(item)}
                            className='w-10 h-10 text-lg'>
                            −
                          </button>
                          <span className='w-12 text-center'>{item.count}</span>
                          <button
                            onClick={() => handleIncrease(item._id)}
                            className='w-10 h-10 text-lg'>
                            +
                          </button>
                        </div>

                        <span className='text-sm text-gray-700'>
                          Total:{" "}
                          <b className='text-[#F78D25]'>
                            ${(item.product.price * item.count).toFixed(2)}
                          </b>
                        </span>
                      </div>
                    </div>

                    {/* Delete */}
                    <div className='flex flex-col items-end gap-3'>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className='cursor-pointer'>
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

            {/* RIGHT SIDE - SUMMARY */}
            <div className='bg-white rounded-xl shadow p-6 h-max sticky top-20'>
              <h3 className='text-lg font-semibold mb-6'>Order Summary</h3>

              {/* Selected Products Preview */}
              <div className='space-y-5 mb-6 max-h-60 overflow-y-auto'>
                {selectedItems.map((item) => (
                  <div
                    key={item._id}
                    className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='w-[60px] h-[60px] rounded-lg overflow-hidden border'>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      <div>
                        <p className='font-medium text-sm'>
                          {item.product.name}
                        </p>
                        <p className='text-gray-500 text-xs'>
                          Quantity:{" "}
                          <span className='font-medium'>x{item.count}</span>
                        </p>
                      </div>
                    </div>

                    <p className='text-[#F78D25] font-semibold'>
                      ${(item.product.price * item.count).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className='my-4 border-gray-300' />

              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className='my-2 border-gray-300' />
                <div className='flex justify-between text-lg font-semibold text-[#F78D25]'>
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={selectedProducts.length === 0}
                className='w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-medium disabled:opacity-40 cursor-pointer'>
                Proceed To Checkout ({selectedProducts.length})
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------
            CHECKOUT VIEW
        -------------------------------------------------------- */
        <div className='max-w-[1200px] mx-auto'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>
            <button
              onClick={() => setShowCheckout(false)}
              className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium'>
              Back to Cart
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
                    Shipping Details
                  </h3>
                </div>

                <div className='space-y-4 text-[12px]'>
                  {/* Full name */}
                  <div>
                    <label className='block text-[#666] mb-[4px]'>
                      Full Name*
                    </label>
                    <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                      <User className='h-4 w-4 text-[#C2B7EB]' />
                      <input
                        name='fullName'
                        value={checkoutData.fullName}
                        onChange={handleCheckoutInputChange}
                        className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                        placeholder='Your name'
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        Email*
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
                        Telephone*
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
                      Address*
                    </label>
                    <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                      <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                      <input
                        name='address'
                        value={checkoutData.address}
                        onChange={handleCheckoutInputChange}
                        className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                        placeholder='Street, city, region'
                      />
                    </div>
                  </div>

                  {/* Country + City */}
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        Country*
                      </label>
                      <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                        <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                        <input
                          name='country'
                          value={checkoutData.country}
                          onChange={handleCheckoutInputChange}
                          className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder='Enter country'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        City*
                      </label>
                      <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                        <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                        <input
                          name='city'
                          value={checkoutData.city}
                          onChange={handleCheckoutInputChange}
                          className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder='Enter city'
                        />
                      </div>
                    </div>
                  </div>

                  {/* State + Postal Code */}
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        State/Province
                      </label>
                      <input
                        name='state'
                        value={checkoutData.state}
                        onChange={handleCheckoutInputChange}
                        className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                        placeholder='State or province'
                      />
                    </div>
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        Postal Code
                      </label>
                      <input
                        name='postalCode'
                        value={checkoutData.postalCode}
                        onChange={handleCheckoutInputChange}
                        className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                        placeholder='Postal code'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5'>
                <div className='flex items-center gap-2 mb-4'>
                  <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]'>
                    <CreditCard className='h-4 w-4 text-[#9B51E0]' />
                  </span>
                  <h3 className='text-[14px] font-semibold text-[#222]'>
                    Payment Method
                  </h3>
                </div>

                {/* Method list */}
                <div className='space-y-3 text-[12px] mb-4'>
                  {/* Card */}
                  <div
                    className={`rounded-[10px] ${
                      checkoutData.paymentMethod === "card"
                        ? "bg-gradient-to-r from-[#9838E1] to-[#F68E44] p-[1px]"
                        : ""
                    }`}>
                    <div
                      className={`flex items-center justify-between rounded-[9px] ${
                        checkoutData.paymentMethod === "card"
                          ? "bg-[#FAF7FF]"
                          : "border border-[#E3E1ED] bg-white"
                      } px-3 py-[9px] cursor-pointer`}
                      onClick={() => handlePaymentMethodChange("card")}>
                      <div className='flex items-center gap-2'>
                        <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-white'>
                          <CreditCard className='h-3.5 w-3.5 text-[#9B51E0]' />
                        </span>
                        <div>
                          <p className='text-[12px] font-semibold text-[#4A4A4A]'>
                            Credit/Debit Card
                          </p>
                          <p className='text-[11px] text-[#9B51E0]'>
                            Visa, Mastercard, American Express
                          </p>
                        </div>
                      </div>
                      <span
                        className={`h-[14px] w-[14px] rounded-full ${
                          checkoutData.paymentMethod === "card"
                            ? "border-2 border-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_0_0_2px_rgba(152,56,225,0.25)]"
                            : "border border-[#D3D3E6]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Cash on delivery */}
                  <div
                    className={`rounded-[10px] ${
                      checkoutData.paymentMethod === "cod"
                        ? "bg-gradient-to-r from-[#9838E1] to-[#F68E44] p-[1px]"
                        : ""
                    }`}>
                    <div
                      className={`flex items-center justify-between rounded-[9px] ${
                        checkoutData.paymentMethod === "cod"
                          ? "bg-[#FAF7FF]"
                          : "border border-[#E3E1ED] bg-white"
                      } px-3 py-[9px] cursor-pointer`}
                      onClick={() => handlePaymentMethodChange("cod")}>
                      <div className='flex items-center gap-2'>
                        <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F4ECFF]'>
                          <ShieldCheck className='h-3.5 w-3.5 text-[#9B51E0]' />
                        </span>
                        <p className='text-[12px] text-[#4A4A4A]'>
                          Cash On Delivery
                        </p>
                      </div>
                      <span
                        className={`h-[14px] w-[14px] rounded-full ${
                          checkoutData.paymentMethod === "cod"
                            ? "border-2 border-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_0_0_2px_rgba(152,56,225,0.25)]"
                            : "border border-[#D3D3E6]"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Card fields - Only show if card payment selected */}
                {checkoutData.paymentMethod === "card" && (
                  <div className='space-y-3 text-[12px]'>
                    {/* Card number */}
                    <div>
                      <label className='block text-[#666] mb-[4px]'>
                        Card number*
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
                          Expiration Date*
                        </label>
                        <input
                          name='expiryDate'
                          value={checkoutData.expiryDate}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder='MM/YY'
                        />
                      </div>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          CVV*
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
                          Name of the Holder*
                        </label>
                        <input
                          name='cardHolderName'
                          value={checkoutData.cardHolderName}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder='Name on the card'
                        />
                      </div>
                      <div>
                        <label className='block text-[#666] mb-[4px]'>
                          City*
                        </label>
                        <input
                          name='billingCity'
                          value={checkoutData.billingCity}
                          onChange={handleCheckoutInputChange}
                          className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                          placeholder='Billing city'
                        />
                      </div>
                    </div>

                    {/* Stripe note + checkbox */}
                    <div className='mt-3 space-y-2'>
                      <div className='flex items-start gap-2 text-[11px] text-[#7F7F90]'>
                        <ShieldCheck className='mt-[1px] h-4 w-4 text-[#52B788]' />
                        <p>
                          Your payment is protected by Stripe, <br />
                          <span className='text-[#9B51E0]'>
                            256-bit SSL encryption
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
                        My billing address is the same as my shipping address
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE – ORDER SUMMARY */}
            <aside className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5 h-fit sticky top-20'>
              <h3 className='text-[14px] font-semibold text-[#222] mb-4'>
                Order Summary
              </h3>

              {/* Items */}
              <div className='space-y-3 text-[12px] mb-4 max-h-60 overflow-y-auto'>
                {selectedItems.map((item) => (
                  <div
                    key={item._id}
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
                        <p className='text-[12px] font-semibold text-[#333]'>
                          {item.product.name}
                        </p>
                        <p className='text-[11px] text-[#9B9B9B]'>
                          Quantity: {item.count}
                        </p>
                      </div>
                    </div>
                    <p className='text-[12px] font-semibold text-[#F78D25]'>
                      ${(item.product.price * item.count).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className='space-y-1 text-[11px] text-[#777] mb-4'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span className='text-[#333]'>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipment</span>
                  <span className='text-[#333]'>${shipping.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax (5%)</span>
                  <span className='text-[#333]'>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className='flex justify-between items-center text-[12px] font-semibold text-[#333] mb-4'>
                <span>Total</span>
                <span className='text-[#F78D25]'>${finalTotal.toFixed(2)}</span>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirmAndPay}
                disabled={orderLoading}
                className='flex w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] py-[10px] text-[13px] font-medium text-white shadow-[0_4px_16px_rgba(0,0,0,0.20)] mb-3'>
                <Lock className='h-4 w-4' />
                {orderLoading
                  ? "Processing..."
                  : checkoutData.paymentMethod === "cod"
                  ? "Confirm Order"
                  : "Confirm and Pay"}
              </button>

              {/* Security line */}
              <div className='flex items-center justify-center gap-2 mb-3'>
                <CheckCircle2 className='h-4 w-4 text-[#52B788]' />
                <p className='text-[11px] text-[#777]'>
                  100% secure and encrypted payment.
                </p>
              </div>

              {/* Payment methods */}
              <div className='flex border-t border-[#F1ECF8] justify-center w-full'>
                <div className='pt-3'>
                  <p className='text-[11px] text-[#999] mb-2'>
                    Accepted payment methods
                  </p>
                  <div className='flex gap-2'>
                    <span className='inline-flex items-center justify-center rounded-[4px] bg-[#1A1F71] px-2 py-[2px] text-[10px] font-semibold text-white'>
                      VISA
                    </span>
                    <span className='inline-flex items-center justify-center rounded-[4px] bg-[#EB001B] px-2 py-[2px] text-[10px] font-semibold text-white'>
                      MC
                    </span>
                    <span className='inline-flex items-center justify-center rounded-[4px] bg-[#F79E1B] px-2 py-[2px] text-[10px] font-semibold text-white'>
                      AMEX
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}
