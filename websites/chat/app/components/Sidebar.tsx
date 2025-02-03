"use client";

import React from 'react';
import { useChat } from '../context/ChatContext';

const Sidebar = () => {
  const { rooms, switchRoom, addRoom } = useChat();

  return (
    <div className="w-1/4 flex flex-col bg-white p-4 relative z-10">
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
      <div className="flex-grow flex items-end">
        <button
          onClick={addRoom}
          className="w-full p-2 bg-blue-500 text-white rounded mt-4"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 