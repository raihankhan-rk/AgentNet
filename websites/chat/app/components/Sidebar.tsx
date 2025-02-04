"use client";

import Icons from '@/assets/Icons';
import { useChat } from '../context/ChatContext';

const Sidebar = () => {
  const { rooms, switchRoom, addRoom } = useChat();

  return (
    <div className="w-1/4 flex flex-col bg-white p-4 relative z-10">
      <div className="flex flex-row items-center justify-center gap-1 pb-2 border-b-[1px] border-[#E6E2FB] mb-2">
        <Icons.fullLogo className="w-full h-7"/>
      </div>
      <ul className="flex flex-col gap-2">
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => switchRoom(room.id)}
            className="cursor-pointer bg-[#FFF1FB] w-full p-3 rounded-lg"
          >
            {room.name}
          </li>
        ))}
      </ul>
      <div className="flex-grow flex items-end">
        <button
          onClick={addRoom}
          className="w-full p-2 bg-gradient-to-br from-[#C4CAFF] to-[#F8E1F9] text-white rounded mt-4"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 