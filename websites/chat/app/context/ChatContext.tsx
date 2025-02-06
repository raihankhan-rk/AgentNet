"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  content: string;
  type: 'user' | 'agent' | 'system';
}

interface ChatRoom {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatContextType {
  rooms: ChatRoom[];
  currentRoomId: string;
  isTyping: boolean;
  addMessage: (content: string, type: 'user' | 'agent' | 'system') => void;
  switchRoom: (roomId: string) => void;
  addRoom: () => void;
  setIsTyping: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([
    { id: '1', name: 'New Chat', messages: [] },
  ]);
  const [currentRoomId, setCurrentRoomId] = useState<string>('1');
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (content: string, type: 'user' | 'agent' | 'system') => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === currentRoomId) {
          const newMessages = [...room.messages, { content, type }];
          const newName =
            room.messages.length === 0 && type === 'user'
              ? content.split(' ').slice(0, 3).join(' ') + '...'
              : room.name;
          return { ...room, messages: newMessages, name: newName };
        }
        return room;
      })
    );
  };

  const switchRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  const addRoom = () => {
    const newRoom: ChatRoom = {
      id: (rooms.length + 1).toString(),
      name: 'New Chat',
      messages: [],
    };
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    setCurrentRoomId(newRoom.id);
  };

  return (
    <ChatContext.Provider
      value={{ 
        rooms, 
        currentRoomId, 
        isTyping, 
        addMessage, 
        switchRoom, 
        addRoom,
        setIsTyping 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 