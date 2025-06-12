import { useState, useCallback, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { RoomSidebar } from "@/components/chat/RoomSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { Room, Message, User, RoomCreationData } from "@/types/chat";

// Mock data
const mockCurrentUser: User = {
  id: "current-user",
  name: "You",
  status: "online",
  color: "bg-blue-500",
};

const mockUsers: User[] = [
  { id: "user-1", name: "Raman", status: "online", color: "bg-green-500" },
  { id: "user-2", name: "Rahul", status: "online", color: "bg-purple-500" },
  { id: "user-3", name: "Aditya", status: "online", color: "bg-blue-500" },
  { id: "user-4", name: "Aman", status: "online", color: "bg-orange-500" },
];

const mockRooms: Room[] = [
  {
    id: "room-1",
    name: "Chatting",
    purpose: "chat",
    isPrivate: false,
    members: [mockCurrentUser, ...mockUsers],
  },
  {
    id: "room-2",
    name: "Fun-chat",
    purpose: "gossip",
    isPrivate: false,
    members: [mockCurrentUser, mockUsers[0], mockUsers[1]],
  },
  {
    id: "room-3",
    name: "Tech-Talk",
    purpose: "education",
    isPrivate: true,
    members: [mockCurrentUser, mockUsers[2]],
  },
  {
    id: "room-4",
    name: "Dev talk",
    purpose: "study",
    isPrivate: true,
    members: [mockCurrentUser, mockUsers[1], mockUsers[2]],
  },
  {
    id: "room-5",
    name: "Random Talks",
    purpose: "gossip",
    isPrivate: true,
    members: [mockCurrentUser, mockUsers[0], mockUsers[3]],
  },
  {
    id: "room-6",
    name: "Desk Help",
    purpose: "work",
    isPrivate: true,
    members: [mockCurrentUser, mockUsers[1]],
  },
  {
    id: "room-7",
    name: "Chit-Chat",
    purpose: "chat",
    isPrivate: false,
    members: [mockCurrentUser, ...mockUsers.slice(0, 2)],
  },
];

const mockMessages: Record<string, Message[]> = {
  "room-1": [
    {
      id: "msg-1",
      content: "kaise ho bhai log",
      senderId: "user-1",
      senderName: "Raman",
      timestamp: new Date("2025-06-02T20:01:00"),
      status: "delivered",
    },
    {
      id: "msg-2",
      content: "are raman bhai",
      senderId: "current-user",
      senderName: "You",
      timestamp: new Date("2025-06-02T20:01:30"),
      status: "delivered",
      isOwn: true,
    },
    {
      id: "msg-3",
      content: "kaise ho",
      senderId: "current-user",
      senderName: "You",
      timestamp: new Date("2025-06-02T20:01:45"),
      status: "delivered",
      isOwn: true,
    },
    {
      id: "msg-4",
      content: "kaha the bhai abhi tak",
      senderId: "user-2",
      senderName: "Rahul",
      timestamp: new Date("2025-06-02T20:01:50"),
      status: "delivered",
    },
    {
      id: "msg-5",
      content: "bas the kahi par",
      senderId: "user-1",
      senderName: "Raman",
      timestamp: new Date("2025-06-02T20:02:00"),
      status: "delivered",
    },
    {
      id: "msg-6",
      content: "kaha bhai, hame bhi btao",
      senderId: "current-user",
      senderName: "You",
      timestamp: new Date("2025-06-02T20:02:15"),
      status: "delivered",
      isOwn: true,
    },
    {
      id: "msg-7",
      content: "chhodo ye sab",
      senderId: "user-1",
      senderName: "Raman",
      timestamp: new Date("2025-06-02T20:02:30"),
      status: "delivered",
    },
    {
      id: "msg-8",
      content: "ye sab btao, kya chl rha",
      senderId: "user-1",
      senderName: "Raman",
      timestamp: new Date("2025-06-02T20:02:45"),
      status: "delivered",
    },
    {
      id: "msg-9",
      content: "kucch khas nhi bhai",
      senderId: "user-2",
      senderName: "Rahul",
      timestamp: new Date("2025-06-02T20:03:00"),
      status: "delivered",
    },
    {
      id: "msg-10",
      content: "hello",
      senderId: "user-1",
      senderName: "Raman",
      timestamp: new Date("2025-06-03T09:29:00"),
      status: "delivered",
    },
    {
      id: "msg-11",
      content: "hiii",
      senderId: "current-user",
      senderName: "You",
      timestamp: new Date("2025-06-03T12:00:00"),
      status: "delivered",
      isOwn: true,
    },
    {
      id: "msg-12",
      content: "nnnnnnnnnnnnnnnnnnnn",
      senderId: "current-user",
      senderName: "You",
      timestamp: new Date("2025-06-03T15:13:00"),
      status: "delivered",
      isOwn: true,
    },
    {
      id: "msg-13",
      content: "cccg",
      senderId: "current-user",
      senderName: "You",
      timestamp: new Date("2025-06-03T15:15:00"),
      status: "delivered",
      isOwn: true,
    },
    {
      id: "msg-14",
      content: "🙂🙃😁😆🙃😄",
      senderId: "current-user",
      senderName: "You",
      timestamp: new Date(),
      status: "delivered",
      isOwn: true,
    },
  ],
};

export default function Chat() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("room-1");
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    window.innerWidth >= 768,
  );
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      } else if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const currentMessages = messages[selectedRoomId] || [];

  const handleCreateRoom = useCallback((roomData: RoomCreationData) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: roomData.name,
      purpose: roomData.purpose,
      isPrivate: roomData.isPrivate,
      members: [mockCurrentUser],
    };
    setRooms((prev) => [...prev, newRoom]);
  }, []);

  const handleJoinRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
  }, []);

  const handleOpenChat = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedRoomId) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        senderId: mockCurrentUser.id,
        senderName: mockCurrentUser.name,
        timestamp: new Date(),
        status: "sent",
        isOwn: true,
      };

      setMessages((prev) => ({
        ...prev,
        [selectedRoomId]: [...(prev[selectedRoomId] || []), newMessage],
      }));
    },
    [selectedRoomId],
  );

  const handleAddMembers = useCallback(() => {
    // In a real app, this would open a member selection dialog
    console.log("Add members clicked");
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const containerStyle: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", // Prevent page scroll
  };

  const mainContentStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    minHeight: 0,
    maxHeight: "100%", // Ensure it doesn't exceed container
    position: "relative",
    overflow: "hidden", // Contain scrolling within children
  };

  const sidebarContainerStyle: React.CSSProperties = {
    transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 30,
    ...(isMobile
      ? {
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "320px",
          boxShadow: isSidebarOpen ? "8px 0 32px rgba(0, 0, 0, 0.15)" : "none",
        }
      : {
          position: "relative",
          width: isSidebarOpen ? "320px" : "0",
          overflow: "hidden",
        }),
  };

  const chatAreaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 0, // Allow flex shrinking
    maxHeight: "100%", // Ensure proper height constraint
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    ...(isMobile && isSidebarOpen
      ? { filter: "blur(2px)", pointerEvents: "none" }
      : {}),
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 25,
    display: isMobile && isSidebarOpen ? "block" : "none",
    backdropFilter: "blur(4px)",
  };
  return (
    <div style={containerStyle} className="bg-slate-50 dark:bg-slate-900">
      <ChatHeader
        currentUser={mockCurrentUser}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      <div style={mainContentStyle}>
        {/* Mobile Overlay */}
        <div style={overlayStyle} onClick={() => setIsSidebarOpen(false)} />

        {/* Sidebar */}
        <div style={sidebarContainerStyle}>
          <RoomSidebar
            rooms={rooms}
            currentUser={mockCurrentUser}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onOpenChat={handleOpenChat}
            selectedRoomId={selectedRoomId}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Chat Area */}
        <div style={chatAreaStyle}>
          <ChatArea
            room={selectedRoom}
            messages={currentMessages}
            currentUser={mockCurrentUser}
            onSendMessage={handleSendMessage}
            onAddMembers={handleAddMembers}
          />
        </div>
      </div>
    </div>
  );
}
