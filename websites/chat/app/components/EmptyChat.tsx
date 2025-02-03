"use client";

import React from 'react';

const EmptyChat = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <h3 className="text-2xl font-semibold mb-2">Welcome to AI Chat</h3>
        <p className="text-lg">Start a conversation by typing a message below</p>
      </div>
    </div>
  );
};

export default EmptyChat; 