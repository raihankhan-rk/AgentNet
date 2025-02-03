import React from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import TextInput from './components/TextInput';
import { ChatProvider } from './context/ChatContext';
import AnimatedOrbs from '../assets/AnimatedOrbs';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex h-screen w-screen overflow-hidden relative">
        
          <AnimatedOrbs />  
       
        <Sidebar />
        <div className="flex flex-col flex-1 z-10">
          <ChatArea />
          <TextInput />
        </div>
      </div>
    </ChatProvider>
  );
}
