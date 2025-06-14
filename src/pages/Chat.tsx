import { useState, useCallback, useEffect, useRef } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { RoomSidebar } from "@/components/chat/RoomSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { Room, Message, User, RoomCreationData, RoomMembers } from "@/types/chat";
import { useSocketContext } from "@/hooks/useSocketContext";
import { getClientId } from "@/lib/clientId";
import { Outlet, useParams } from "react-router-dom";
import { roomsApi } from "@/api/roomApi";
import { useApiWithToast } from "@/hooks/useApiWithToast";
import { userApi } from "@/api/userApi";

// Mock data
// const mockCurrentUser: User = {
//   _id: "current-user",
//   name: "You",
//   status: "online",
//   color: "bg-blue-500",
// };

// const mockUsers: User[] = [
//   { _id: "user-1", name: "Raman", status: "online", color: "bg-green-500" },
//   { _id: "user-2", name: "Rahul", status: "online", color: "bg-purple-500" },
//   { _id: "user-3", name: "Aditya", status: "online", color: "bg-blue-500" },
//   { _id: "user-4", name: "Aman", status: "online", color: "bg-orange-500" },
// ];

// const mockRooms: Room[] = [
//   {
//     _id: "room-1",
//     name: "Chatting",
//     purpose: "chat",
//     isPrivate: false,
//     members: [mockCurrentUser, ...mockUsers],
//   },
//   {
//     _id: "room-2",
//     name: "Fun-chat",
//     purpose: "gossip",
//     isPrivate: false,
//     members: [mockCurrentUser, mockUsers[0], mockUsers[1]],
//   },
//   {
//     _id: "room-3",
//     name: "Tech-Talk",
//     purpose: "education",
//     isPrivate: true,
//     members: [mockCurrentUser, mockUsers[2]],
//   },
//   {
//     _id: "room-4",
//     name: "Dev talk",
//     purpose: "study",
//     isPrivate: true,
//     members: [mockCurrentUser, mockUsers[1], mockUsers[2]],
//   },
//   {
//     _id: "room-5",
//     name: "Random Talks",
//     purpose: "gossip",
//     isPrivate: true,
//     members: [mockCurrentUser, mockUsers[0], mockUsers[3]],
//   },
//   {
//     _id: "room-6",
//     name: "Desk Help",
//     purpose: "work",
//     isPrivate: true,
//     members: [mockCurrentUser, mockUsers[1]],
//   },
//   {
//     _id: "room-7",
//     name: "Chit-Chat",
//     purpose: "chat",
//     isPrivate: false,
//     members: [mockCurrentUser, ...mockUsers.slice(0, 2)],
//   },
// ];

// const mockMessages: Record<string, Message[]> = {
//   "room-1": [
//     {
//       _id: "msg-1",
//       roomId: "room-1",
//       content: "kaise ho bhai log",
//       senderId: "user-1",
//       senderName: "Raman",
//       timestamp: new Date("2025-06-02T20:01:00"),
//       status: "delivered",
//     },
//     {
//       _id: "msg-2",
//       roomId: "room-1",
//       content: "are raman bhai",
//       senderId: "current-user",
//       senderName: "You",
//       timestamp: new Date("2025-06-02T20:01:30"),
//       status: "delivered",
//       isOwn: true,
//     },
//     {
//       _id: "msg-3",
//       roomId: "room-1",
//       content: "kaise ho",
//       senderId: "current-user",
//       senderName: "You",
//       timestamp: new Date("2025-06-02T20:01:45"),
//       status: "delivered",
//       isOwn: true,
//     },
//     {
//       _id: "msg-4",
//       roomId: "room-1",
//       content: "kaha the bhai abhi tak",
//       senderId: "user-2",
//       senderName: "Rahul",
//       timestamp: new Date("2025-06-02T20:01:50"),
//       status: "delivered",
//     },
//     {
//       _id: "msg-5",
//       roomId: "room-1",
//       content: "bas the kahi par",
//       senderId: "user-1",
//       senderName: "Raman",
//       timestamp: new Date("2025-06-02T20:02:00"),
//       status: "delivered",
//     },
//     {
//       _id: "msg-6",
//       roomId: "room-1",
//       content: "kaha bhai, hame bhi btao",
//       senderId: "current-user",
//       senderName: "You",
//       timestamp: new Date("2025-06-02T20:02:15"),
//       status: "delivered",
//       isOwn: true,
//     },
//     {
//       _id: "msg-7",
//       roomId: "room-1",
//       content: "chhodo ye sab",
//       senderId: "user-1",
//       senderName: "Raman",
//       timestamp: new Date("2025-06-02T20:02:30"),
//       status: "delivered",
//     },
//     {
//       _id: "msg-8",
//       roomId: "room-1",
//       content: "ye sab btao, kya chl rha",
//       senderId: "user-1",
//       senderName: "Raman",
//       timestamp: new Date("2025-06-02T20:02:45"),
//       status: "delivered",
//     },
//     {
//       _id: "msg-9",
//       roomId: "room-1",
//       content: "kucch khas nhi bhai",
//       senderId: "user-2",
//       senderName: "Rahul",
//       timestamp: new Date("2025-06-02T20:03:00"),
//       status: "delivered",
//     },
//     {
//       _id: "msg-10",
//       roomId: "room-1",
//       content: "hello",
//       senderId: "user-1",
//       senderName: "Raman",
//       timestamp: new Date("2025-06-03T09:29:00"),
//       status: "delivered",
//     },
//     {
//       _id: "msg-11",
//       roomId: "room-1",
//       content: "hiii",
//       senderId: "current-user",
//       senderName: "You",
//       timestamp: new Date("2025-06-03T12:00:00"),
//       status: "delivered",
//       isOwn: true,
//     },
//     {
//       _id: "msg-12",
//       roomId: "room-1",
//       content: "nnnnnnnnnnnnnnnnnnnn",
//       senderId: "current-user",
//       senderName: "You",
//       timestamp: new Date("2025-06-03T15:13:00"),
//       status: "delivered",
//       isOwn: true,
//     },
//     {
//       _id: "msg-13",
//       roomId: "room-1",
//       content: "cccg",
//       senderId: "current-user",
//       senderName: "You",
//       timestamp: new Date("2025-06-03T15:15:00"),
//       status: "delivered",
//       isOwn: true,
//     },
//     {
//       _id: "msg-14",
//       roomId: "room-1",
//       content: "🙂🙃😁😆🙃😄",
//       senderId: "current-user",
//       senderName: "You",
//       timestamp: new Date(),
//       status: "delivered",
//       isOwn: true,
//     },
//   ],
// };

export default function Chat() {
  const { callApi } = useApiWithToast();
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomDetails, setRoomDetails] = useState<Room>(null); // Initialize roomId state


  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingUser, setCurrentTypingUser] = useState(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const currentUser = useRef(getClientId())?.current;
  const { roomId } = useParams();

  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    window.innerWidth >= 768,
  );
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    if (roomId) {
      setSelectedRoomId(roomId);
    }
  }, [roomId]);

  const fetchRoomDetailById = async () => {
    if (!roomId) return;
    const response = await callApi(() => roomsApi.getRoomById(roomId), {
      successMessage: "Room fetched successfully!",
      errorMessage: "Failed to fetch room",
      onSuccess: () => console.log("Room was fetched successfully"),
      onError: (err) => console.error("Failed to fetch room", err),
    });
    if (response.success && response.data) {
      setRoomDetails(response?.data)
      console.log("Room Details:", response.data); // response.data is Room
    }
  };

  const getAllUsers = async () => {
    const response = await callApi(() => userApi.getAllUsers(), {
      successMessage: "Users fetched successfully!",
      errorMessage: "Failed to fetched user",
      onSuccess: () => console.log("User fetching was successful"),
    });
    if (response.success && response.data) {
      setAllUsers(response?.data)
      console.log("User Details:", response.data); // response.data is Room
    }
  };

  const getAllRooms = async () => {
    const response = await callApi(() => roomsApi.getRooms(), {
      successMessage: "Rooms fetched successfully!",
      errorMessage: "Failed to fetch rooms",
      onSuccess: () => console.log("Rooms fetched successful"),
    });
    if (response.success && response.data) {
      setRooms(response?.data)
      console.log("Room Details:", response.data); // response.data is Room
    }
  };

  useEffect(() => {
    getAllRooms();
    fetchRoomDetailById();
    getAllUsers();
  }, [roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    // join the room
    socket.emit('join room', roomId);

    // recieve old messages for the room
    socket.on('message history', (history) => {
      console.log('Message history received:', history);
      setMessages(history);
    });

    // listen for incoming chat messages
    socket.on('chat message', ({ _id, senderId, senderName, content, timestamp, status, isOwn }, callback) => {
      console.log('Message received:', content, 'from senderId:', senderId);
      setMessages((prev) => [...prev, { _id, senderId, senderName, content, roomId, timestamp, status, isOwn }]);
      if (callback) callback(null, { status: 'ok' });
    });

    // on typing 
    socket.on('typing', ({ roomId, senderId }) => {
      console.log(`${senderId} is typing...  `);
      setIsTyping(true);
      setCurrentTypingUser(senderId);
    });

    socket.on('typing stopped', ({ roomId, senderId }) => {
      console.log(`${senderId} stopped typing`);
      setIsTyping(false);
      setCurrentTypingUser(null);
    });

    // clean fn
    return () => {
      socket.off('typing');
      socket.off('join room');
      socket.off('typing stopped');
      socket.off('chat message');
      socket.off('message history');
    }
  }, [socket, roomId]);

  const emitTyping = (isTyping: boolean) => {
    if (isTyping) {
      console.log('Emitting typing event: ' + currentUser.username + "---- " + roomId);
      socket.emit('typing', { roomId, senderId: currentUser.username });
    }
    else {
      console.log('Emitting typing stopped event' + currentUser.username + "---- " + roomId);
      socket.emit('typing stopped', { roomId, senderId: currentUser.username });
    }
  };

  const addMembersToRoom = async (data: RoomMembers) => {
    const response = await callApi(() => roomsApi.addMembers({ members: data.members, roomId }), {
      successMessage: "Member/s added successfully!",
      errorMessage: "Failed to add members to room",
      onSuccess: () => console.log("Member/s added successfully!"),
    });

    if (response.success && response.data) {
      fetchRoomDetailById();
    };
  };

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  const roomMembers = (roomDetails?.members ? roomDetails?.members.length > 0 ? roomDetails?.members : [] : []);

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

  const selectedRoom = roomDetails //&& roomDetails.find((room) => room._id === selectedRoomId);
  //  const currentMessages = messages[selectedRoomId] || [];

  // const handleCreateRoom = useCallback((roomData: RoomCreationData) => {
  //   const newRoom: Room = {
  //     _id: `room-${Date.now()}`,
  //     name: roomData.name,
  //     purpose: roomData.purpose,
  //     isPrivate: roomData.isPrivate,
  //     members: [mockCurrentUser],
  //   };
  //   setRooms((prev) => [...prev, newRoom]);
  // }, []);

  // const handleJoinRoom = useCallback((roomId: string) => {
  //   setSelectedRoomId(roomId);
  // }, []);

  // const handleOpenChat = useCallback((roomId: string) => {
  //   setSelectedRoomId(roomId);
  // }, []);

  const handleSendMessage = useCallback((content: string) => {
    if (!roomId && !content.trim()) return;
    console.log('Sending message:', content, 'from clientId:', currentUser.username);

    // emit to server
    const newMessage: Message = {
      content,
      roomId,
      senderId: currentUser._id,
      senderName: currentUser.username,
      timestamp: new Date(),
      status: "sent",
      isOwn: true,
    };

    socket.emit('chat message', newMessage,
      (err) => {
        if (err) console.error('Ack error:', err);
      });

    // setMessages((prev) => ({
    //   ...prev,
    //   [selectedRoomId]: [...(prev[selectedRoomId] || []), newMessage],
    // }));
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
    <div style={chatAreaStyle}>
      <ChatArea
        room={roomDetails}
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onAddMembers={handleAddMembers}
        allUsers = {allUsers}
      />
    </div>
  );
}
