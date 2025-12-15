import Order from "../../models/OrderModel.js";
import Payment from "../../models/PaymentModel.js";
import Refund from "../../models/RefundModel.js";

/**
 * Customer submits a refund request for an order/payment
 */
export const requestRefund = async (req, res) => {
  try {
    const { paymentId, orderId, userId, amount, reason, evidence } = req.body;

    if (!paymentId || !orderId || !userId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = await Payment.findOne({ paymentId });
    const order = await Order.findById(orderId);
    if (!payment || !order)
      return res.status(404).json({ message: "Payment or order not found" });

    const refund = await Refund.create({
      payment: payment._id,
      order: order._id,
      requestedBy: userId,
      amount,
      currency: payment.currency || "usd",
      reason,
      evidence,
      status: "requested",
    });

    return res.status(201).json({ message: "Refund requested", refund });
  } catch (err) {
    console.error("requestRefund error", err);
    return res
      .status(500)
      .json({ message: "Failed to request refund", error: err.message });
  }
};

export default { requestRefund };
