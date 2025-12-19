import Conversation from "../../models/ConversationModel.js";
import Message from "../../models/MessageSchema.js";

export const openConversation = async (req, res) => {
    console.log("HIT");
  try {
    const { participants, type, orderId, bookingId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: participants },
      type
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants, type, orderId, bookingId });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.log(error, "socket error");
    res.status(500).json({ message: error.message, error });
  }
};


export const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({
      participants: userId
    }).populate("participants", "name role image");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, receiver, message } = req.body;
    console.log("hit krosa");

    // const msg = await Message.create({
    //   conversationId,
    //   sender,
    //   receiver,
    //   message
    // });

    // Update lastMessage in conversation
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message });

    res.status(200).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Validate conversationId
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Get messages for the conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Sort by oldest first
      .populate("sender", "name role image")
      .populate("receiver", "name role image")
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: error.message, error });
  }
};