"use client";

import Icons from '@/assets/Icons';
import { useChat } from '../context/ChatContext';
import { FundButton } from '@coinbase/onchainkit/fund';
import { WalletComponents } from './walletConnectButton';
import {useAccount} from 'wagmi';

const Sidebar = () => {
  const { rooms, switchRoom, addRoom } = useChat();

  const {address} = useAccount()

  return (
    <div className="w-1/4 flex flex-col bg-white p-4 relative z-[100]">
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
      
      {/* <div className="flex-grow flex items-end">
        <button
          onClick={addRoom}
          className="w-full p-2 h-12 bg-gradient-to-br font-bold hover:text-[#7B88F9] from-[#C4CAFF] to-[#F8E1F9] text-white rounded mt-4"
        >
          New Chat
        </button>
      </div> */}
        <div className=' w-full flex flex-col h-full justify-end gap-2 py-2 items-end backdrop-blur-xl mt-2'>
            {address && <FundButton hideIcon={true} text='Fund Agent'  className='hover:-translate-y-1 text-white hover:text-[#7B88F9] duration-200 bg-gradient-to-br rounded from-[#C4CAFF] to-[#F8E1F9] w-full' />}
            <WalletComponents />
          </div>
    </div>
  );
};

export default Sidebar; 