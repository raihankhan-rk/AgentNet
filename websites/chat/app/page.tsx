'use client'
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import TextInput from './components/TextInput';
import { ChatProvider } from './context/ChatContext';
import AnimatedOrbs from '../assets/AnimatedOrbs';
import { FundButton } from '@coinbase/onchainkit/fund';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex h-screen w-screen overflow-hidden relative">
          <AnimatedOrbs />  
          {/* <FundButton className='absolute z-[10000] right-2 top-2'/> */}
        <Sidebar />
        <div className="flex flex-col flex-1 z-10">
          <ChatArea />
          <TextInput />
        </div>
      </div>
    </ChatProvider>
  );
}
