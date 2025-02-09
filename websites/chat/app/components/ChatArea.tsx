"use client";

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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


  const formatMessage = (content: any) => {
    try {
      // Check if content is already a string
      if (typeof content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(content);
          return parsed.content || parsed.message || content;
        } catch {
          // If not valid JSON, return as is
          return content;
        }
      }

      // If content is an object
      if (typeof content === 'object' && content !== null) {
        if (content.type === 'error') {
          return `Error: ${content.content}`;
        }
        return content.content || content.message || JSON.stringify(content);
      }

      return String(content);
    } catch (e) {
      return String(content);
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
              className={`flex ${message.type === 'user'
                  ? 'justify-end'
                  : message.type === 'system'
                    ? 'justify-center'
                    : 'justify-start'
                }`}
            >
              <div
                className={`${message.type === 'user'
                    ? 'bg-[#C4CAFF] backdrop-blur-sm border-[1px] border-white text-black ml-auto max-w-[70%]'
                    : message.type === 'system'
                      ? 'bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full'
                      : 'bg-white/50 backdrop-blur-sm border-[1px] border-white text-black shadow mr-auto max-w-[70%]'
                  } rounded-lg p-3 prose prose-sm max-w-none`}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-600 hover:text-blue-800 underline decoration-blue-400 decoration-2 underline-offset-2 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                    br: ({ node, ...props }) => <br className="block my-2" {...props} />,
                  }}
                >
                  {formatMessage(message.content)}
                </ReactMarkdown>
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