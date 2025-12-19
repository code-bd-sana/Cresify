"use client";

import Image from "next/image";
import { AiOutlineSend } from "react-icons/ai";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useMyChatListQuery } from "@/feature/chat/ChatApi";
import { io } from "socket.io-client";

export default function ChatUI() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  const { data: chatListData, refetch: refetchChatList } = useMyChatListQuery(userId);
  const chatList = chatListData?.data || [];

  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const messagesRef = useRef([]);

  // Helper function to check if message is from me
  const isMessageFromMe = useCallback((message) => {
    if (!message || !userId) return false;
    
    // Check different formats of sender
    if (typeof message.sender === 'string') {
      return message.sender === userId;
    } else if (message.sender && typeof message.sender === 'object') {
      return message.sender._id === userId;
    }
    return false;
  }, [userId]);

  // Update messagesRef
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Restore selected chat from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSelectedChat = localStorage.getItem('selectedChat');
      const savedConversationId = localStorage.getItem('conversationId');
      
      if (savedSelectedChat && savedSelectedChat !== 'null') {
        setSelectedChat(savedSelectedChat);
      }
      if (savedConversationId && savedConversationId !== 'null') {
        setConversationId(savedConversationId);
      }
    }
  }, []);

  // Save selected chat to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedChat) {
      localStorage.setItem('selectedChat', selectedChat);
    }
  }, [selectedChat]);

  // Save conversationId to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && conversationId) {
      localStorage.setItem('conversationId', conversationId);
    }
  }, [conversationId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize socket
  useEffect(() => {
    if (!userId) return;

    const socketInstance = io("http://localhost:5000", {
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
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      
      // Rejoin conversation if exists
      if (conversationId && socketRef.current) {
        socketRef.current.emit("join_conversation", conversationId);
      }
    });

    socketInstance.on("receive_message", (message) => {
      console.log("New message received:", message);
      
      if (conversationId && message.conversationId === conversationId) {
        // Skip if this is our own message
        if (isMessageFromMe(message)) {
          console.log("Skipping receive_message - this is our own message");
          return;
        }
        
        setMessages(prev => [...prev, message]);
      }
      
      // Refetch chat list for updated last message
      refetchChatList();
    });

    socketInstance.on("message_sent", (message) => {
      console.log("Message sent confirmation:", message);
      
      // Replace temp message with real message
      setMessages(prev => {
        const filtered = prev.filter(msg => {
          // Remove temp messages that are from me
          if (msg._id?.startsWith('temp-') && isMessageFromMe(msg)) {
            return false;
          }
          return true;
        });
        
        const messageExists = filtered.some(msg => msg._id === message._id);
        if (!messageExists) {
          return [...filtered, message];
        }
        return filtered;
      });
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [userId, conversationId, refetchChatList, isMessageFromMe]);

  // Load or create conversation when chat is selected
  useEffect(() => {
    if (!selectedChat || !userId) return;

    const loadOrCreateConversation = async () => {
      setIsLoadingConversation(true);
      try {
        // Find the selected chat user
        const chatUser = chatList.find(chat => chat._id === selectedChat);
        if (!chatUser) {
          setIsLoadingConversation(false);
          return;
        }
        
        setSelectedChatUser(chatUser);

        // First, try to get existing conversations
        const convResponse = await fetch(
          `http://localhost:5000/api/chat/conversations/${userId}`,
          {
            credentials: "include",
          }
        );
        
        if (!convResponse.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const conversations = await convResponse.json();
        console.log("Conversations:", conversations);

        // Check if conversation already exists with this user
        let existingConversation = null;
        if (conversations && Array.isArray(conversations)) {
          existingConversation = conversations.find((conv) => {
            return conv.participants?.some(p => p._id === selectedChat);
          });
        }

        if (existingConversation) {
          console.log("Existing conversation found:", existingConversation._id);
          setConversationId(existingConversation._id);
          await loadMessages(existingConversation._id);
          
          // Join conversation room
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("join_conversation", existingConversation._id);
          }
        } else {
          console.log("No existing conversation found, creating new one");
          // Create new conversation
          const openConvResponse = await fetch(
            "http://localhost:5000/api/chat/openConversation",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                participants: [userId, selectedChat],
                type: "order",
                orderId: null,
              }),
            }
          );

          if (!openConvResponse.ok) {
            throw new Error('Failed to create conversation');
          }

          const newConversation = await openConvResponse.json();
          console.log("New conversation:", newConversation);
          
          if (newConversation && newConversation._id) {
            setConversationId(newConversation._id);
            
            // Join conversation room
            if (socketRef.current && socketRef.current.connected) {
              socketRef.current.emit("join_conversation", newConversation._id);
            }
            
            // Load empty messages for new conversation
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Error loading/creating conversation:", error);
      } finally {
        setIsLoadingConversation(false);
      }
    };

    // Only run if we don't already have the conversation loaded
    if (!conversationId || selectedChatUser?._id !== selectedChat) {
      loadOrCreateConversation();
    }
  }, [selectedChat, userId, chatList]);

  // Load messages for conversation
  const loadMessages = async (conversationId) => {
    if (!conversationId) return;
    
    setIsLoadingMessages(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/messages/${conversationId}`,
        {
          credentials: "include",
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const messagesData = await response.json();
      console.log("Messages loaded:", messagesData);
      
      if (messagesData && Array.isArray(messagesData)) {
        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !conversationId || !socketRef.current || !userId || !selectedChatUser) {
      console.log("Cannot send message: missing required data");
      return;
    }

    const messageData = {
      conversationId: conversationId,
      sender: userId,
      receiver: selectedChatUser._id,
      message: newMessage.trim(),
    };

    console.log("Sending message:", messageData);

    // Generate unique temp ID
    const tempId = `temp-${Date.now()}`;
    
    // Optimistic update - explicitly mark as my message
    const tempMessage = {
      ...messageData,
      _id: tempId,
      sender: userId, // Send as string to match backend
      receiver: selectedChatUser._id,
      createdAt: new Date(),
      message: newMessage.trim(),
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      // Send via socket
      socketRef.current.emit("send_message", messageData);

    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic update on error
      setMessages((prev) => prev.filter(msg => msg._id !== tempId));
      alert("Failed to send message. Please try again.");
    }
  }, [newMessage, conversationId, userId, selectedChatUser]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up temp messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => {
        const now = Date.now();
        return prev.filter(msg => {
          if (msg._id?.startsWith('temp-')) {
            const timestamp = parseInt(msg._id.split('-')[1]);
            // Keep temp messages for 30 seconds max
            return !isNaN(timestamp) && (now - timestamp) < 30000;
          }
          return true;
        });
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle chat selection
  const handleChatSelect = useCallback((chatId) => {
    // Don't do anything if clicking the same chat
    if (chatId === selectedChat) return;
    
    // Reset message input
    setNewMessage("");
    
    // Leave previous conversation room if exists
    if (socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit("leave_conversation", conversationId);
    }
    
    // Set new selected chat
    setSelectedChat(chatId);
    
    // Clear conversation data - will be reloaded in useEffect
    setSelectedChatUser(null);
    setConversationId(null);
    setMessages([]);
  }, [selectedChat, conversationId]);

  return (
    <div className="w-full h-screen flex bg-[#F6F6F9]">
      {/* LEFT SIDEBAR */}
      <div className="w-[300px] border-r border-gray-200 bg-[#F5EEF8] flex flex-col">
        <div className="p-5">
          <h1 className="text-[28px] font-semibold text-[#8D55DA]">Messages</h1>
          <input
            type="text"
            placeholder="Search customer ..."
            className="w-full mt-4 px-4 py-2 rounded-lg border border-[#E0D2F2] text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {chatList?.length > 0 ? (
            chatList.map((chat) => {
              const isSelected = selectedChat === chat._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat._id)}
                  className={`flex items-center gap-3 px-5 py-3 bg-[#F5EEF8] border-[#E8DFF5] hover:bg-[#f0e6fb] cursor-pointer relative ${
                    isSelected ? "bg-[#f0e6fb]" : ""
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 h-full w-[4px] bg-[#E3C653] rounded-r-lg"></div>
                  )}
                  <div className="relative">
                    <Image
                      src={chat.image || chat.businessLogo || "/user.png"}
                      alt={chat.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/user.png";
                      }}
                    />
                    {/* Online status dot */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold truncate">{chat.name}</h4>
                    <p className="text-[12px] text-[#A889D4] leading-tight truncate">
                      {chat.lastMessage || chat.email || "Start conversation"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-5 py-3 text-center text-gray-500 text-sm">
              No chats available
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#F7F7FA]">
        {selectedChat && selectedChatUser && conversationId ? (
          <>
            <div className="flex items-center gap-4 px-8 py-5 bg-white">
              <div className="relative">
                <Image
                  src={selectedChatUser.image || selectedChatUser.businessLogo || "/user.png"}
                  width={45}
                  height={45}
                  className="rounded-full object-cover"
                  alt="user"
                  onError={(e) => {
                    e.currentTarget.src = "/user.png";
                  }}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-[17px] font-semibold">
                  {selectedChatUser.name}
                </h2>
                <p className="text-green-500 text-sm flex items-center gap-1">
                  ● Online
                </p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 px-8 py-8 overflow-y-auto space-y-4">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                    <p>Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = isMessageFromMe(msg);
                  const showAvatar = index === 0 || isMessageFromMe(messages[index - 1]) !== isMe;

                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} items-end`}
                    >
                      {/* Other user's avatar */}
                      {!isMe && showAvatar && (
                        <Image
                          src={selectedChatUser.image || selectedChatUser.businessLogo || "/user.png"}
                          width={32}
                          height={32}
                          className="rounded-full mr-2 object-cover"
                          alt="avatar"
                        />
                      )}
                      {!isMe && !showAvatar && <div className="w-[32px] mr-2"></div>}

                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[260px] text-[15px] leading-snug shadow-sm ${
                          isMe
                            ? "bg-[#B155E0] text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <div className="break-words">{msg.message}</div>
                        <div
                          className={`text-xs mt-1 flex justify-end ${
                            isMe ? "text-purple-200" : "text-gray-500"
                          }`}
                        >
                          {msg._id?.startsWith("temp-") ? (
                            <span className="italic text-yellow-600">Sending...</span>
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
                          className="rounded-full ml-2"
                          alt="me"
                        />
                      )}
                      {isMe && !showAvatar && <div className="w-[32px] ml-2"></div>}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BOX */}
            <div className="px-8 py-5 bg-white flex items-center gap-3 shadow-[0_-3px_15px_rgba(0,0,0,0.05)]">
              <div className="flex-1 border border-[#D2B7FF] rounded-xl px-5 py-3 flex items-center">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="flex-1 outline-none text-[15px] bg-transparent"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!socket}
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !socket}
                className={`p-3 rounded-xl shadow-md flex items-center justify-center ${
                  newMessage.trim() && socket
                    ? "bg-gradient-to-r from-[#B155E0] to-[#F78B3D] hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                title={!socket ? "Socket not connected" : "Send message"}
              >
                <AiOutlineSend size={20} className="text-white" />
              </button>
            </div>
          </>
        ) : selectedChat && isLoadingConversation ? (
          // Loading conversation
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Loading conversation...
              </h3>
            </div>
          </div>
        ) : selectedChat ? (
          // No conversation loaded yet
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Preparing conversation...
              </h3>
            </div>
          </div>
        ) : (
          // No chat selected
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a chat from the left sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}