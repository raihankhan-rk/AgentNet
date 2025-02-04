import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import TextInput from './components/TextInput';
import { ChatProvider } from './context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex h-screen w-screen overflow-hidden relative">
        <Sidebar />
        <div className="flex flex-col flex-1 z-10">
          <ChatArea />
          <TextInput />
        </div>
      </div>
    </ChatProvider>
  );
}
