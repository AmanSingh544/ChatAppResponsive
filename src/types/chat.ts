export interface User {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
  status: "online" | "offline" | "away";
}

export interface Room {
  id: string;
  name: string;
  purpose: string;
  isPrivate: boolean;
  members: User[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  isOwn?: boolean;
}

export interface RoomCreationData {
  name: string;
  purpose: string;
  isPrivate: boolean;
  description?: string;
}

export type Purpose = "chat" | "gossip" | "education" | "study" | "work";

export const PURPOSE_OPTIONS: string[] = [
  "chat",
  "gossip",
  "education",
  "study",
  "work",
];
