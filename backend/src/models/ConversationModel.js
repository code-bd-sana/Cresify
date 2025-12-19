import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" } // always 2 users
  ],
  type: {
    type: String,
    enum: ["order", "booking"],
    required: false
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: false },
  lastMessage: { type: String },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Conversation = mongoose.model("conversation", ConversationSchema);
export default Conversation;

