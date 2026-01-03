"use client";

import {
  useProviderChatListQuery,
  useSellerChatListQuery,
} from "@/feature/chat/ChatApi";
import { base_url, root_url } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineSend } from "react-icons/ai";
import { io } from "socket.io-client";

export default function ChatUI() {
  const { t } = useTranslation("seller");
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  // Role-based data fetching
  const {
    data: sellerChatList,
    refetch: refetchSellerChats,
    isLoading: isLoadingSellerChats,
  } = useSellerChatListQuery(userId, {
    skip: userRole !== "seller" || !userId,
  });

  const {
    data: providerChatList,
    refetch: refetchProviderChats,
    isLoading: isLoadingProviderChats,
  } = useProviderChatListQuery(userId, {
    skip: userRole !== "provider" || !userId,
  });

  console.log(providerChatList, "kire ascosc tui");

  const chatList =
    userRole === "seller" ? sellerChatList?.data : providerChatList?.data;
  const isLoadingChats =
    userRole === "seller" ? isLoadingSellerChats : isLoadingProviderChats;

  const [selectedChat, setSelectedChat] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [socketError, setSocketError] = useState(null);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const conversationRef = useRef(null);
  const messagesRef = useRef([]);

  // Refs to prevent infinite loops
  useEffect(() => {
    conversationRef.current = conversation;
    messagesRef.current = messages;
  }, [conversation, messages]);

  // Helper function to check if message is from me
  const isMessageFromMe = useCallback(
    (message) => {
      if (!message || !userId) return false;

      // Check different formats of sender
      if (typeof message.sender === "string") {
        return message.sender === userId;
      } else if (message.sender && typeof message.sender === "object") {
        return message.sender._id === userId;
      }
      return false;
    },
    [userId]
  );

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize socket - ONE TIME ONLY
  useEffect(() => {
    if (!userId || socketRef.current) return;

    console.log("Initializing socket connection for user:", userId);

    const socketInstance = io(root_url, {
      query: { userId },
      withCredentials: true,
      transports: ["websocket", "polling"],
      path: "/socket.io/",
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected successfully:", socketInstance.id);
      setSocket(socketInstance);
      setConnectionStatus("connected");
      setSocketError(null);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setConnectionStatus("disconnected");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error.message);
      setConnectionStatus("error");
      setSocketError(error.message);
    });

    socketInstance.on("receive_message", (message) => {
      console.log("📥 New message received (receive_message):", message);

      const currentConversation = conversationRef.current;
      const currentMessages = messagesRef.current;

      // Skip if this is our own message
      if (isMessageFromMe(message)) {
        console.log("Skipping receive_message - this is our own message");
        return;
      }

      if (
        currentConversation &&
        message.conversationId === currentConversation._id
      ) {
        // Check if message already exists
        const messageExists = currentMessages.some(
          (msg) =>
            msg._id === message._id ||
            (msg._id?.startsWith("temp-") && msg.message === message.message)
        );

        if (!messageExists) {
          console.log("Adding received message to UI");
          setMessages((prev) => [...prev, message]);
        }
      }
    });

    socketInstance.on("message_sent", (message) => {
      console.log("✅ Message sent confirmation (message_sent):", message);

      // Replace temp message with real message
      setMessages((prev) => {
        // Remove temp messages
        const filtered = prev.filter(
          (msg) => !(msg._id?.startsWith("temp-") && isMessageFromMe(msg))
        );

        // Check if message already exists
        const messageExists = filtered.some((msg) => msg._id === message._id);
        if (!messageExists) {
          console.log("Adding confirmed message to UI");
          return [...filtered, message];
        }
        return filtered;
      });
    });

    socketInstance.on("user_online", (onlineUserId) => {
      console.log(`🟢 User ${onlineUserId} is online`);
      setOnlineUsers((prev) => ({ ...prev, [onlineUserId]: true }));
    });

    socketInstance.on("user_offline", (offlineUserId) => {
      console.log(`🔴 User ${offlineUserId} is offline`);
      setOnlineUsers((prev) => ({ ...prev, [offlineUserId]: false }));
    });

    return () => {
      console.log("Cleaning up socket connection");
      if (socketInstance) {
        socketInstance.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnectionStatus("disconnected");
      }
    };
  }, [userId, userRole, isMessageFromMe]);

  // Load messages function
  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    setIsLoadingMessages(true);
    try {
      console.log("Loading messages for conversation:", conversationId);

      const response = await fetch(
        `${base_url}/chat/messages/${conversationId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log("Messages loaded:", data);

      if (data && Array.isArray(data)) {
        setMessages(data || []);
      } else {
        console.error("Unexpected messages data format:", data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Load or create conversation when chat is selected
  useEffect(() => {
    if (!selectedChat || !userId) return;

    const loadOrCreateConversation = async () => {
      try {
        console.log("Selected chat:", selectedChat);

        // First, try to get existing conversations
        const convResponse = await fetch(
          `${base_url}/chat/conversations/${userId}`,
          {
            credentials: "include",
          }
        );

        const convData = await convResponse.json();
        console.log("Conversations data:", convData);

        // Check if conversation already exists with this user
        let existingConversation = null;
        if (convData && Array.isArray(convData)) {
          existingConversation = convData.find((conv) => {
            // Check if any participant matches the selected chat user ID
            return conv.participants?.some((p) => p._id === selectedChat._id);
          });

          if (existingConversation) {
            console.log("Found existing conversation:", existingConversation);
            // Find the other participant
            const other = existingConversation.participants.find(
              (p) => p._id !== userId
            );
            setOtherParticipant(other);
          }
        }

        if (existingConversation) {
          setConversation(existingConversation);
          loadMessages(existingConversation._id);

          // Join conversation room
          const currentSocket = socketRef.current;
          if (currentSocket) {
            currentSocket.emit("join_conversation", existingConversation._id);
          }
        } else {
          console.log("No existing conversation found, creating new one");
          // Create new conversation
          const openConvResponse = await fetch(
            `${base_url}/chat/openConversation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                participants: [userId, selectedChat._id],
                type: selectedChat.chatType || "order",
                orderId: selectedChat.orderId || null,
              }),
            }
          );

          const openConvData = await openConvResponse.json();
          console.log("New conversation response:", openConvData);

          if (openConvData) {
            setConversation(openConvData);

            // Find the other participant
            const other = openConvData.participants?.find(
              (p) => p._id !== userId
            );
            setOtherParticipant(other || selectedChat);

            // Join conversation room
            const currentSocket = socketRef.current;
            if (currentSocket) {
              currentSocket.emit("join_conversation", openConvData._id);
            }
          } else {
            console.error("Failed to create conversation");
          }
        }
      } catch (error) {
        console.error("Error loading/creating conversation:", error);
      }
    };

    loadOrCreateConversation();
  }, [selectedChat, userId, loadMessages]);

  // Send message function
  const handleSendMessage = useCallback(async () => {
    const currentConversation = conversationRef.current;
    const currentSocket = socketRef.current;

    if (
      !newMessage.trim() ||
      !currentConversation ||
      !currentSocket ||
      !userId ||
      !otherParticipant
    ) {
      console.log("Cannot send message: missing required data");
      return;
    }

    const messageData = {
      conversationId: currentConversation._id,
      sender: userId,
      receiver: otherParticipant._id,
      message: newMessage.trim(),
    };

    console.log("Sending message:", messageData);

    // Generate unique temp ID
    const tempId = `temp-${Date.now()}`;

    // Optimistic update with sender as the current user
    const tempMessage = {
      ...messageData,
      _id: tempId,
      sender: {
        _id: userId,
        name: userName,
        image: userImage,
        role: userRole,
      },
      receiver: {
        _id: otherParticipant._id,
        name: otherParticipant.name,
        image: otherParticipant.image || otherParticipant.businessLogo,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    // Send via socket only - no API call needed
    currentSocket.emit("send_message", messageData);

    // Handle send failure
    const errorTimeout = setTimeout(() => {
      setMessages((prev) => {
        const msgExists = prev.some(
          (msg) => msg._id === tempId && msg._id?.startsWith("temp-")
        );
        if (msgExists) {
          console.log("Message sending timed out, removing temp message");
          return prev.filter((msg) => msg._id !== tempId);
        }
        return prev;
      });
    }, 5000);

    // Clear timeout if message is confirmed
    const clearErrorTimeout = () => clearTimeout(errorTimeout);

    // Listen for message confirmation
    const handleMessageSent = (confirmedMessage) => {
      if (
        isMessageFromMe(confirmedMessage) &&
        confirmedMessage.message === newMessage.trim()
      ) {
        clearErrorTimeout();
      }
    };

    currentSocket.once("message_sent", handleMessageSent);

    return () => {
      clearErrorTimeout();
      currentSocket.off("message_sent", handleMessageSent);
    };
  }, [
    newMessage,
    userId,
    otherParticipant,
    userName,
    userImage,
    userRole,
    isMessageFromMe,
  ]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up temp messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => {
        const now = Date.now();
        return prev.filter((msg) => {
          if (msg._id?.startsWith("temp-")) {
            const timestamp = parseInt(msg._id.split("-")[1]);
            // Keep temp messages for 30 seconds max
            return !isNaN(timestamp) && now - timestamp < 30000;
          }
          return true;
        });
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle chat selection
  const handleChatSelect = useCallback((chat) => {
    // Reset states before selecting new chat
    setConversation(null);
    setOtherParticipant(null);
    setMessages([]);
    setNewMessage("");
    setSelectedChat(chat);

    // Leave previous conversation room if exists
    const currentSocket = socketRef.current;
    const currentConversation = conversationRef.current;
    if (currentSocket && currentConversation) {
      currentSocket.emit("leave_conversation", currentConversation._id);
    }
  }, []);

  return (
    <div className='w-full h-screen flex bg-[#F6F6F9]'>
      {/* Connection Status Bar */}
      {/* <div className='absolute top-0 left-0 right-0 z-50'>
        <div
          className={`${
            connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"
          } text-white text-sm px-4 py-1 flex justify-between items-center`}>
          <span>
            {t("chat.socketStatus")}: {connectionStatus}{" "}
            {socket?.id ? `(${socket.id})` : ""}
          </span>
          {socketError && (
            <span className='text-xs'>
              {t("chat.error")}: {socketError}
            </span>
          )}
        </div>
      </div> */}

      {/* LEFT SIDEBAR */}
      <div className='w-[300px] border-r border-gray-200 bg-[#F5EEF8] flex flex-col mt-8'>
        <div className='p-5'>
          <h1 className='text-[28px] font-semibold text-[#8D55DA]'>
            {t("messages.title")}
          </h1>
          <input
            type='text'
            placeholder={t("chat.searchPlaceholder")}
            className='w-full mt-4 px-4 py-2 rounded-lg border border-[#E0D2F2] text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-300'
          />
        </div>

        {/* Contact List */}
        <div className='overflow-y-auto flex-1'>
          {isLoadingChats ? (
            <div className='px-5 py-3 text-center text-gray-500'>
              {t("chat.loadingChats")}
            </div>
          ) : chatList?.length > 0 ? (
            chatList.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;
              const isOnline = onlineUsers[chat._id];

              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer relative ${
                    isSelected
                      ? "bg-[#f0e6fb]"
                      : "bg-[#F5EEF8] hover:bg-[#f0e6fb]"
                  }`}>
                  {isSelected && (
                    <div className='absolute left-0 top-0 h-full w-[4px] bg-[#E3C653] rounded-r-lg'></div>
                  )}

                  {/* Avatar */}
                  <div className='relative'>
                    <Image
                      src={chat.image || chat.businessLogo || "/user.png"}
                      alt={chat.name}
                      width={40}
                      height={40}
                      className='rounded-full object-cover'
                      onError={(e) => {
                        e.currentTarget.src = "/user.png";
                      }}
                    />
                    {/* Online Status */}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}></div>
                  </div>

                  {/* Chat Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-[15px] font-semibold truncate'>
                        {chat.name}
                      </h4>
                    </div>
                    <p className='text-[12px] text-[#A889D4] leading-tight truncate'>
                      {chat.email || t("chat.startConversation")}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='px-5 py-3 text-center text-gray-500 text-sm'>
              {t("chat.noChats")}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className='flex-1 flex flex-col bg-[#F7F7FA] mt-8'>
        {selectedChat && conversation ? (
          <>
            {/* Chat Header */}
            <div className='flex items-center justify-between px-8 py-5 bg-white border-b'>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <Image
                    src={
                      otherParticipant?.image ||
                      otherParticipant?.businessLogo ||
                      "/user.png"
                    }
                    width={45}
                    height={45}
                    className='rounded-full object-cover'
                    alt='user'
                    onError={(e) => {
                      e.currentTarget.src = "/user.png";
                    }}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      onlineUsers[otherParticipant?._id]
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}></div>
                </div>
                <div>
                  <h2 className='text-[17px] font-semibold'>
                    {otherParticipant?.name || selectedChat.name}
                  </h2>
                  <p className='text-sm text-gray-500'>
                    {onlineUsers[otherParticipant?._id]
                      ? t("chat.online")
                      : t("chat.offline")}
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div className='flex-1 px-8 py-8 overflow-y-auto space-y-4'>
              {isLoadingMessages ? (
                <div className='h-full flex items-center justify-center'>
                  <div className='text-center text-gray-500'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2'></div>
                    <p>{t("chat.loadingMessages")}</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className='h-full flex items-center justify-center'>
                  <div className='text-center text-gray-500'>
                    <p className='text-lg mb-2'>{t("chat.noMessages")}</p>
                    <p className='text-sm'>
                      {t("chat.startConversationMessage")}
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const showAvatar =
                    index === 0 ||
                    isMessageFromMe(messages[index - 1]) !==
                      isMessageFromMe(msg);

                  const isMe = isMessageFromMe(msg);

                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      } items-end`}>
                      {/* Other user's avatar */}
                      {!isMe && showAvatar && (
                        <Image
                          src={
                            otherParticipant?.image ||
                            otherParticipant?.businessLogo ||
                            "/user.png"
                          }
                          width={32}
                          height={32}
                          className='rounded-full mr-2 object-cover'
                          alt='avatar'
                        />
                      )}
                      {!isMe && !showAvatar && (
                        <div className='w-[32px] mr-2'></div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[260px] text-[15px] leading-snug shadow-sm ${
                          isMe
                            ? "bg-[#B155E0] text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none"
                        }`}>
                        <div className='break-words'>{msg.message}</div>
                        <div
                          className={`text-xs mt-1 flex justify-end ${
                            isMe ? "text-purple-200" : "text-gray-500"
                          }`}>
                          {msg._id?.startsWith("temp-") ? (
                            <span className='italic text-yellow-600'>
                              {t("chat.sending")}
                            </span>
                          ) : (
                            new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          )}
                        </div>
                      </div>

                      {/* My avatar */}
                      {isMe && showAvatar && (
                        <Image
                          src={userImage || "/user.png"}
                          width={32}
                          height={32}
                          className='rounded-full ml-2'
                          alt='me'
                        />
                      )}
                      {isMe && !showAvatar && (
                        <div className='w-[32px] ml-2'></div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BOX */}
            <div className='px-8 py-5 bg-white flex items-center gap-3 shadow-[0_-3px_15px_rgba(0,0,0,0.05)]'>
              <div className='flex-1 border border-[#D2B7FF] rounded-xl px-5 py-3 flex items-center'>
                <input
                  type='text'
                  placeholder={t("chat.typeMessagePlaceholder")}
                  className='flex-1 outline-none text-[15px] bg-transparent'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={connectionStatus !== "connected"}
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={
                  !newMessage.trim() || connectionStatus !== "connected"
                }
                className={`p-3 rounded-xl shadow-md flex items-center justify-center ${
                  newMessage.trim() && connectionStatus === "connected"
                    ? "bg-gradient-to-r from-[#B155E0] to-[#F78B3D] hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                title={
                  connectionStatus !== "connected"
                    ? t("chat.socketNotConnected")
                    : t("chat.sendMessage")
                }>
                <AiOutlineSend size={20} className='text-white' />
              </button>
            </div>
          </>
        ) : selectedChat ? (
          // Loading conversation
          <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4'></div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                {t("chat.loadingConversation")}
              </h3>
            </div>
          </div>
        ) : (
          // No chat selected
          <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='text-center'>
              <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-4xl'>💬</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                {t("messages.emptyState.title")}
              </h3>
              <p className='text-gray-500'>
                {t("messages.emptyState.subtitle")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
