"use client";

import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-blue-100 rounded-lg p-3 flex items-center space-x-1">
        <div className="w-2 h-2 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default TypingIndicator; 