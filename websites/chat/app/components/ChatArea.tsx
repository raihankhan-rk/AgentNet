"use client";

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
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

  const formatErrorMessage = (content: string) => {
    try {
      // First check if there's a human-readable message after JSON errors
      const humanMessageMatch = content.match(/}([^{].*$)/);
      if (humanMessageMatch) {
        const humanMessage = humanMessageMatch[1].trim();
        if (humanMessage) {
          return humanMessage;
        }
      }

      // Try to parse the content as JSON
      const parsedContent = JSON.parse(content);

      // Handle error messages
      if (parsedContent.type === 'error') {
        const errorMessage = parsedContent.content
          .split(':')
          .slice(1)
          .join(':')
          .trim()
          .replace(/\. The agent.*$/, '');
        return `Error: ${errorMessage}`;
      }

      // Handle arrays of objects (like the flight assistant list)
      if (Array.isArray(parsedContent)) {
        return parsedContent
          .map(item => `${item.name}: ${item.description}`)
          .join('\n');
      }

      return parsedContent.content || parsedContent.message || content;
    } catch (e) {
      // If parsing fails, check for human-readable message after JSON errors
      const lastMessage = content.split(/}/).pop()?.trim();
      if (lastMessage && !lastMessage.includes('{')) {
        return lastMessage;
      }
      
      // If no human message found, try to extract error message
      if (content.includes('{"type":"error"')) {
        const match = content.match(/{"type":"error","content":"([^"]+)"}/);
        if (match) {
          const errorMessage = match[1]
            .split(':')
            .slice(1)
            .join(':')
            .trim()
            .replace(/\. The agent.*$/, '');
          return `Error: ${errorMessage}`;
        }
      }
      // Return original content if all parsing fails
      return content;
    }
  };

  if (!currentRoom?.messages.length) {
    return <EmptyChat />;
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-150 to-slate-50 p-4 overflow-y-auto flex flex-col">
      <div className="flex-1">
        <div className="space-y-4">
          {currentRoom?.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' 
                  ? 'justify-end' 
                  : message.type === 'system' 
                    ? 'justify-center' 
                    : 'justify-start'
              }`}
            >
              <div
                className={`${
                  message.type === 'user'
                    ? 'bg-[#C4CAFF] backdrop-blur-sm border-[1px] border-white text-black ml-auto max-w-[70%]'
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full'
                    : 'bg-white/50 backdrop-blur-sm border-[1px] border-white text-black shadow mr-auto max-w-[50vw]'
                } rounded-lg p-3 prose prose-sm max-w-none`}
              >
                <ReactMarkdown>{formatErrorMessage(message.content)}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatArea; 