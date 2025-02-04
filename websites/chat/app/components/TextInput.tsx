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
    <div className="p-4 border-t flex gap-2 items-center bg-white">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1 p-2 border rounded"
        placeholder="Type a message..."
      />
      <button 
        onClick={handleSend} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <Icons.send className="w-6 h-6"/>
      </button>
    </div>
  );
};

export default TextInput; 