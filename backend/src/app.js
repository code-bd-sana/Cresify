/**
 * @file app.js
 * @description Express application configuration and middleware setup for Cresify backend.
 *              Configures CORS, body parsing, cookie handling, routing, and error handling.
 * @module App
 */

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import index from "../src/route/index.js";
import connectDB from "./configure/db.js";
import { stripeWebhook } from "./controller/StripeController.js";
import { Server } from "socket.io";
import Message from "./models/MessageSchema.js";
import Conversation from "./models/ConversationModel.js";
import { createServer } from "http";

/**
 * Express application instance
 * @type {express.Application}
 */
export const app = express();

/**
 * CORS Configuration
 */
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cresify.vercel.app"],
    credentials: true,
  })
);

// Stripe webhook must receive the raw request body so the Stripe signature
// can be verified.
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: "50mb" }));

/**
 * URL-Encoded Parser Middleware
 */
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/**
 * Cookie Parser Middleware
 */
app.use(cookieParser());

/**
 * API Routes
 */
app.use("/api", index);

/** HTTP server needed for Socket.IO */
const server = createServer(app);

/** Socket.IO setup */
const io = new Server(server, { 
  cors: { 
    origin: ["http://localhost:3000", "https://cresify.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  // Add path configuration
  path: "/socket.io/"
});

/** Online users map */
const onlineUsers = new Map();

/** Socket.IO connection */
io.on("connection", (socket) => {
  console.log("✅ New socket connection:", socket.id);
  
  const userId = socket.handshake.query.userId;
  console.log("User ID from query:", userId);
  
  if (!userId) {
    console.log("❌ No userId provided, disconnecting");
    return socket.disconnect();
  }

  // Add user to online users
  onlineUsers.set(userId, socket.id);
  console.log(`✅ User ${userId} is now online (socket: ${socket.id})`);
  
  // Notify others about this user's online status
  socket.broadcast.emit("user_online", userId);

  // Handle join conversation
  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User ${userId} joined conversation ${conversationId}`);
  });

  // Handle leave conversation
  socket.on("leave_conversation", (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`User ${userId} left conversation ${conversationId}`);
  });

  // Handle send message
  socket.on("send_message", async (data) => {
    console.log("message to pahtalam dkeho nana vai");
    console.log("📩 Message received:", data);
    
    try {
      const { conversationId, sender, receiver, message } = data;

      // Save message to DB
      const msg = await Message.create({ 
        conversationId, 
        sender, 
        receiver, 
        message 
      });

      // Update lastMessage in Conversation
      await Conversation.findByIdAndUpdate(conversationId, { 
        lastMessage: message,
        lastMessageAt: new Date()
      });

      // Emit to receiver if online
      const receiverSocket = onlineUsers.get(receiver);
      if (receiverSocket) {
        console.log(`📤 Sending to receiver ${receiver} (socket: ${receiverSocket})`);
        io.to(receiverSocket).emit("receive_message", msg);
      }

      // Emit to sender to confirm delivery
      socket.emit("message_sent", msg);
      
      // Emit to conversation room
      io.to(`conversation_${conversationId}`).emit("new_message", msg);
      
      console.log(`✅ Message saved and sent: ${message.substring(0, 50)}...`);

    } catch (error) {
      console.error("❌ Socket send_message error:", error.message);
      socket.emit("message_error", { error: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User ${userId} disconnected (socket: ${socket.id})`);
    onlineUsers.delete(userId);
    socket.broadcast.emit("user_offline", userId);
  });
});

// Socket connection test endpoint
app.get("/api/socket-test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Socket server is running",
    onlineUsers: Array.from(onlineUsers.keys())
  });
});

// Add health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    socketUsers: onlineUsers.size
  });
});

/** Global error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "File size too large. Please upload an image smaller than 15MB.",
      error: "PayloadTooLargeError",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    error: err.name || "ServerError",
  });
});

/**
 * Initialize Database Connection
 */
connectDB();

// Start server
const PORT = process.env.PORT || 5000;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 Socket.IO running on path /socket.io/`);
  });
}

/** Export server for main entry file to listen */
export { server, io };