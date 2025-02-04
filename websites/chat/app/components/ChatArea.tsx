"use client";

import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import EmptyChat from './EmptyChat';
import TypingIndicator from './TypingIndicator';

const ChatArea = () => {
  const { rooms, currentRoomId, isTyping } = useChat();
  const currentRoom = rooms.find((room) => room.id === currentRoomId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentRoom?.messages, isTyping]);

  if (!currentRoom?.messages.length) {
    return <EmptyChat />;
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-150 to-slate-50 p-4 overflow-y-auto flex flex-col justify-end">
      <div className="space-y-4">
        {currentRoom?.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-[#C4CAFF] backdrop-blur-sm border-[1px] border-white text-black ml-auto'
                  : 'bg-white/50 backdrop-blur-sm border-[1px] border-white text-black shadow mr-auto'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea; 