"use client";

import React from 'react';
import { useChat } from '../context/ChatContext';

const Sidebar = () => {
  const { rooms, switchRoom, addRoom } = useChat();

  return (
    <div className="w-1/4 bg-blue-100 p-4">
      <h2 className="text-lg font-bold">Chats</h2>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => switchRoom(room.id)}
            className="cursor-pointer"
          >
            {room.name}
          </li>
        ))}
      </ul>
      <button
        onClick={addRoom}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        New Chat
      </button>
    </div>
  );
};

export default Sidebar; 