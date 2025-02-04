"use client"
import React, { useState, KeyboardEvent } from 'react';
import { useChat } from '../context/ChatContext';
import Icons from '@/assets/Icons';

const TextInput = () => {
  const [input, setInput] = useState('');
  const { addMessage, setIsTyping } = useChat();

  const handleSend = () => {
    if (input.trim()) {
      addMessage(input, 'user');
      setInput('');
      
      // Simulate agent typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('This is a sample response from the agent.', 'agent');
      }, 2000);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className=" p-4 flex gap-2 items-center">
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