"use client";

import Image from "next/image";
import { AiOutlineSend } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useMyChatListQuery } from "@/feature/chat/ChatApi";
import { initSocket } from "@/utils/socket";


export default function ChatUI() {
  const { data } = useSession();
  const id = data?.user?.id;
  const { data: chatList } = useMyChatListQuery(id);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef(null);

  /** Initialize socket connection */
  useEffect(() => {
    if (id) {
      socketRef.current = initSocket(id);

      socketRef.current.on("receive_message", (msg) => {
        if (msg.conversationId === selectedChat) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [id, selectedChat]);

  /** Load messages when chat selected */
  useEffect(() => {
    if (selectedChat) {
      fetch(`/api/messages/${selectedChat}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []));
    }
  }, [selectedChat]);

  /** Send message */
  const handleSend = () => {
    if (!newMessage || !selectedChat) return;

    const receiverId = chatList?.data?.find((c) => c._id === selectedChat)?._id;

    const msgData = {
      conversationId: selectedChat,
      sender: id,
      receiver: receiverId,
      message: newMessage,
    };

    socketRef.current.emit("send_message", msgData);

    setMessages((prev) => [...prev, { ...msgData, _id: Date.now() }]);
    setNewMessage("");
  };

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

        <div className="overflow-y-auto">
          {chatList?.data?.map((chat, index) => {
            const isSelected = selectedChat === chat._id;
            const hasUnread = true;

            return (
              <div
                key={chat._id || index}
                onClick={() => setSelectedChat(chat._id)}
                className={`flex items-center gap-3 px-5 py-3 bg-[#F5EEF8] border-[#E8DFF5] hover:bg-[#f0e6fb] cursor-pointer relative ${
                  isSelected ? "bg-[#f0e6fb]" : ""
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 h-full w-[4px] bg-[#E3C653] rounded-r-lg"></div>
                )}
                <div className="relative">
                  <Image
                    src={chat.image || "/default-user.png"}
                    alt={chat.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-semibold truncate">{chat.name}</h4>
                  <p className="text-[12px] text-[#A889D4] leading-tight truncate">{chat.email}</p>
                </div>
                {hasUnread && <div className="w-2 h-2 bg-[#9B59ED] rounded-full"></div>}
              </div>
            );
          })}
          {(!chatList?.data || chatList.data.length === 0) && (
            <div className="px-5 py-3 text-center text-gray-500 text-sm">
              No chats available
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#F7F7FA]">
        {selectedChat ? (
          <>
            <div className="flex items-center gap-4 px-8 py-5 bg-white">
              <div className="relative">
                <Image src="/user.png" width={45} height={45} className="rounded-full" alt="user" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-[17px] font-semibold">
                  {chatList?.data?.find((c) => c._id === selectedChat)?.name || "User"}
                </h2>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 px-8 py-8 overflow-y-auto space-y-4">
              {messages.map((msg, index) => {
                const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
                const isMe = msg.sender === id;

                return (
                  <div key={msg._id || index} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end`}>
                    {!isMe && showAvatar && (
                      <Image src="/user.png" width={32} height={32} className="rounded-full mr-2" alt="avatar" />
                    )}
                    {!isMe && !showAvatar && <div className="w-[32px] mr-2"></div>}

                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[260px] text-[15px] leading-snug shadow-sm ${
                        isMe ? "bg-[#B155E0] text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.message || msg.text}
                    </div>

                    {isMe && showAvatar && <Image src="/user.png" width={32} height={32} className="rounded-full ml-2" alt="me" />}
                    {isMe && !showAvatar && <div className="w-[32px] ml-2"></div>}
                  </div>
                );
              })}
            </div>

            {/* INPUT BOX */}
            <div className="px-8 py-5 bg-white flex items-center gap-3 shadow-[0_-3px_15px_rgba(0,0,0,0.05)]">
              <div className="flex-1 border border-[#D2B7FF] rounded-xl px-5 py-3 flex items-center">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="flex-1 outline-none text-[15px]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
              </div>

              <button onClick={handleSend} className="p-3 rounded-xl bg-gradient-to-r from-[#B155E0] to-[#F78B3D] shadow-md">
                <AiOutlineSend size={20} className="text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a chat from the left sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
