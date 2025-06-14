import { T } from "vitest/dist/chunks/environment.d.Dmw5ulng.js";

export interface User {
  _id: string;
  username: string;
  avatar?: string;
  color?: string;
  status?: "online" | "offline" | "away";
}

export interface Room {
  _id: string;
  name: string;
  purpose: string;
  isPrivate: boolean;
  members: User[];
  admin?: string,
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  _id?: string;
  content: string;
  senderId: string;
  senderName: string;
  roomId: string;
  timestamp?: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  isOwn?: boolean;
}

export interface RoomCreationData {
  name: string;
  purpose: string;
  isPrivate: boolean;
  description?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
};

export interface RoomMembers{
  members: string[];
  roomId?: string
}

export type Purpose = "chat" | "gossip" | "education" | "study" | "work";

export const PURPOSE_OPTIONS: string[] = [
  "chat",
  "gossip",
  "education",
  "study",
  "work",
];
