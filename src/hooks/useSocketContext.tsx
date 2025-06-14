import { io, Socket } from 'socket.io-client';
import { API_CONSTANTS } from '@/constants/apiEndpoints';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { Message } from '@/types/chat';


export type ClientToServerEvents = {
  'chat message': (
    data: Message,
    callback?: (error?: string, response?: { status: string }) => void
  ) => void;
  'join room': (roomId: string) => void;
  'typing': (data: { roomId: string; senderId: string }) => void;
  'typing stopped': (data: { roomId: string; senderId: string }) => void;
};

export type ServerToClientEvents = {
  'chat message': (
    data: Message, 
    callback?: (error: string | null, response: { status: string }) => void
  ) => void;
  'join room': (roomId: string) => void;
  'message history': (history: Message[]) => void;
  'typing': (data: { roomId: string; senderId: string }) => void;
  'typing stopped': (data: { roomId: string; senderId: string }) => void;
};

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

type SocketProviderProps = {
  children: ReactNode;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_CONSTANTS.API_BASE_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
