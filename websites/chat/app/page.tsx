import React from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import TextInput from './components/TextInput';
import { ChatProvider } from './context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <ChatArea />
          <TextInput />
        </div>
      </div>
    </ChatProvider>
  );
}
