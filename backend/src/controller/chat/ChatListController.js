import Booking from "../../models/BookingModel.js";
import OrderModel from "../../models/OrderModel.js";
import OrderVendorModel from "../../models/OrderVendorModel.js";
import User from "../../models/UserModel.js";

export const myChatList = async (req, res) => {
  console.log("object");
  try {
    const id = req.params.id;
    console.log(id, "id asca kamalla");

    /* ======================
       1️⃣ PROVIDERS (Booking)
       ====================== */

    const bookings = await Booking.find({ customer: id })
      .select("provider");

    const providerIds = bookings.map(b => b.provider);

    const providers = await User.find({
      _id: { $in: providerIds }
    }).select("name email role image businessLogo");

    const uniqueProviders = [
      ...new Map(providers.map(p => [p._id.toString(), p])).values()
    ];

    /* ======================
       2️⃣ SELLERS (Orders)
       ====================== */

    const orders = await OrderModel.find({ customer: id })
      .select("orderVendors");

    const orderVendorIds = orders.flatMap(o => o.orderVendors);

    const orderVendors = await OrderVendorModel.find({
      _id: { $in: orderVendorIds }
    }).select("seller");

    const sellerIds = orderVendors.map(ov => ov.seller);

    const sellers = await User.find({
      _id: { $in: sellerIds }
    }).select("name email role image businessLogo");

    const uniqueSellers = [
      ...new Map(sellers.map(s => [s._id.toString(), s])).values()
    ];

    /* ======================
       3️⃣ FINAL CHAT LIST
       ====================== */

    const chatList = [
      ...uniqueProviders.map(u => ({
        ...u._doc,
        chatType: "booking"
      })),
      ...uniqueSellers.map(u => ({
        ...u._doc,
        chatType: "order"
      }))
    ];

    return res.status(200).json({
      success: true,
      total: chatList.length,
      data: chatList
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error
    });
  }
};



export const providerChatList = async (req, res) => {
  try {
    const id = req.params.id; // provider id

    /* ======================
       1️⃣ Booking → customers
       ====================== */

    const bookings = await Booking.find({ provider: id })
      .select("customer");

    const customerIds = bookings.map(b => b.customer);

    if (customerIds.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        data: []
      });
    }

    /* ======================
       2️⃣ User → customers
       ====================== */

    const customers = await User.find({
      _id: { $in: customerIds }
    }).select("name email role image businessLogo");

    /* ======================
       3️⃣ Remove duplicates
       ====================== */

    const uniqueCustomers = [
      ...new Map(customers.map(c => [c._id.toString(), c])).values()
    ];

    /* ======================
       4️⃣ Response
       ====================== */

    return res.status(200).json({
      success: true,
      total: uniqueCustomers.length,
      data: uniqueCustomers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error
    });
  }
};


export const sellerChatList = async (req, res) => {
  try {
    const id = req.params.id; // seller id

    /* ======================
       1️⃣ OrderVendor → orders
       ====================== */

    const orderVendors = await OrderVendorModel.find({ seller: id })
      .select("order");

    const orderIds = orderVendors.map(ov => ov.order);

    if (orderIds.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        data: []
      });
    }

    /* ======================
       2️⃣ Orders → customers
       ====================== */

    const orders = await OrderModel.find({
      _id: { $in: orderIds }
    }).select("customer");

    const customerIds = orders.map(o => o.customer);

    /* ======================
       3️⃣ Users → customers
       ====================== */

    const customers = await User.find({
      _id: { $in: customerIds }
    }).select("name email role image");

    /* ======================
       4️⃣ Unique customers
       ====================== */

    const uniqueCustomers = [
      ...new Map(customers.map(c => [c._id.toString(), c])).values()
    ];

    /* ======================
       5️⃣ Response
       ====================== */

    return res.status(200).json({
      success: true,
      total: uniqueCustomers.length,
      data: uniqueCustomers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error
    });
  }
};

