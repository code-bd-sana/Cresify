"use client";

import Image from "next/image";
import { AiOutlineSend } from "react-icons/ai";
import { useState } from "react";

export default function ChatUI() {
  const messages = [
    { id: 1, sender: "user", text: "omg, this is amazing" },
    { id: 2, sender: "user", text: "perfect! ✅" },
    { id: 3, sender: "user", text: "Wow, this is really epic" },
    { id: 4, sender: "user", text: "just ideas for next time" },
    { id: 5, sender: "user", text: "I'll be there in 2 mins ⏱️" },
    { id: 6, sender: "user", text: "aww" },
    { id: 7, sender: "user", text: "omg, this is amazing" },
    { id: 8, sender: "user", text: "woohoooo 🔥" },
    { id: 9, sender: "me", text: "How are you?" },
    { id: 10, sender: "me", text: "woohoooo" },
    { id: 11, sender: "me", text: "Haha oh man" },
    { id: 12, sender: "me", text: "Haha that's terrifying 😂" },
  ];

  return (
    <div className="w-full h-screen flex bg-[#F6F6F9]">
      {/* LEFT SIDEBAR */}
      <div className="w-[300px] border-r border-gray-200 bg-[#F5EEF8] flex flex-col">
        {/* Title + Search */}
        <div className="p-5">
          <h1 className="text-[28px] font-semibold text-[#8D55DA]">Messages</h1>

          <input
            type="text"
            placeholder="Search customer ..."
            className="w-full mt-4 px-4 py-2 rounded-lg border border-[#E0D2F2] text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* Contact List */}
        <div className="overflow-y-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 bg-[#F5EEF8] border-[#E8DFF5] hover:bg-[#f0e6fb] cursor-pointer relative"
            >
              {/* Selected Yellow Bar */}
              <div className="absolute left-0 top-0 h-full w-[4px] bg-[#E3C653] rounded-r-lg"></div>

              <Image
                src="/user.png"
                alt="profile"
                width={40}
                height={40}
                className="rounded-full"
              />

              <div className="flex-1">
                <h4 className="text-[15px] font-semibold">Elmer Laverty</h4>
                <p className="text-[12px] text-[#A889D4] leading-tight">
                  Hi there, what is the price of this bag?
                </p>
              </div>

              {/* Purple Dot */}
              <div className="w-2 h-2 bg-[#9B59ED] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#F7F7FA]">
        {/* Chat Header */}
        <div className="flex items-center gap-4 px-8 py-5 bg-white">
          <Image
            src="/user.png"
            width={45}
            height={45}
            className="rounded-full"
            alt="user"
          />
          <div>
            <h2 className="text-[17px] font-semibold">Elmer Laverty</h2>
            <p className="text-green-500 text-sm flex items-center gap-1">
              ● Online
            </p>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 px-8 py-8 overflow-y-auto space-y-4">
          {messages.map((msg, index) => {
            const showAvatar =
              index === 0 || messages[index - 1].sender !== msg.sender;

            const isMe = msg.sender === "me";

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } items-end`}
              >
                {/* Avatar only on first message of the group */}
                {!isMe && showAvatar && (
                  <Image
                    src="/user.png"
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                    alt="avatar"
                  />
                )}

                {/* Empty placeholder to align grouped bubbles */}
                {!isMe && !showAvatar && <div className="w-[32px] mr-2"></div>}

                <div
                  className={`
          px-4 py-2 rounded-2xl max-w-[260px] text-[15px] leading-snug shadow-sm
          ${
            isMe
              ? "bg-[#B155E0] text-white rounded-br-none"
              : "bg-white text-gray-800 rounded-bl-none"
          }
        `}
                >
                  {msg.text}
                </div>

                {/* Avatar for "me" only on first message of the group */}
                {isMe && showAvatar && (
                  <Image
                    src="/user.png"
                    width={32}
                    height={32}
                    className="rounded-full ml-2"
                    alt="me"
                  />
                )}

                {/* Placeholder for my grouped messages */}
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
            />
          </div>

          <button className="p-3 rounded-xl bg-gradient-to-r from-[#B155E0] to-[#F78B3D] shadow-md">
            <AiOutlineSend size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
