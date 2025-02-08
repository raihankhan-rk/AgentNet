"use client"
import React, { useState, KeyboardEvent } from 'react';
import { useChat } from '../context/ChatContext';
import Icons from '@/assets/Icons';

const TextInput = () => {
  const [input, setInput] = useState('');
  const { addMessage, setIsTyping } = useChat();
  const [isInitialized, setIsInitialized] = useState(true);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      addMessage(userMessage, 'user');
      setInput('');
      
      setIsTyping(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        
        if (typeof data === 'object' && data !== null) {
          if ('toolInvocation' in data) {
            addMessage(`🛠️ Using tool: ${data.toolInvocation}`, 'system');
          }
          if ('agentConnection' in data) {
            addMessage(`🤝 Connecting to ${data.agentConnection}...`, 'system');
          }
          if ('content' in data) {
            addMessage(data.content, 'agent');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, there was an error processing your request.', 'system');
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 flex gap-2 items-center">
      <div className="flex-1 flex gap-2 items-center bg-white px-2 pl-0 h-12 border rounded-lg overflow-hidden">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full h-full pl-2 outline-none"
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSend} 
          className=""
        >
          <Icons.send className="w-6 h-6 text-[#C4CAFF] hover:text-[#aeb4ea]"/>
        </button>
      </div>
    </div>
  );
};

export default TextInput; 