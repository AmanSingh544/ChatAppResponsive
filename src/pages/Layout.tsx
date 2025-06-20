import { ChatHeader } from "@/components/chat/ChatHeader";
import { RoomSidebar } from "@/components/chat/RoomSidebar";
import { Room, User } from "@/types/chat";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const mockCurrentUser: User = {
    _id: "current-user",
    name: "You",
    status: "online",
    color: "bg-blue-500",
};

const mockUsers: User[] = [
    { _id: "user-1", name: "Raman", status: "online", color: "bg-green-500" },
    { _id: "user-2", name: "Rahul", status: "online", color: "bg-purple-500" },
    { _id: "user-3", name: "Aditya", status: "online", color: "bg-blue-500" },
    { _id: "user-4", name: "Aman", status: "online", color: "bg-orange-500" },
];

const mockRooms: Room[] = [
    {
        _id: "room-1",
        name: "Chatting",
        purpose: "chat",
        isPrivate: false,
        members: [mockCurrentUser, ...mockUsers],
    },
    {
        _id: "room-2",
        name: "Fun-chat",
        purpose: "gossip",
        isPrivate: false,
        members: [mockCurrentUser, mockUsers[0], mockUsers[1]],
    },
    {
        _id: "room-3",
        name: "Tech-Talk",
        purpose: "education",
        isPrivate: true,
        members: [mockCurrentUser, mockUsers[2]],
    },
    {
        _id: "room-4",
        name: "Dev talk",
        purpose: "study",
        isPrivate: true,
        members: [mockCurrentUser, mockUsers[1], mockUsers[2]],
    },
    {
        _id: "room-5",
        name: "Random Talks",
        purpose: "gossip",
        isPrivate: true,
        members: [mockCurrentUser, mockUsers[0], mockUsers[3]],
    },
    {
        _id: "room-6",
        name: "Desk Help",
        purpose: "work",
        isPrivate: true,
        members: [mockCurrentUser, mockUsers[1]],
    },
    {
        _id: "room-7",
        name: "Chit-Chat",
        purpose: "chat",
        isPrivate: false,
        members: [mockCurrentUser, ...mockUsers.slice(0, 2)],
    },
];

const Layout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
        window.innerWidth >= 768,
    );
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [selectedRoomId, setSelectedRoomId] = useState<string>("room-1");


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
        <>
            <div style={containerStyle} className="bg-slate-50 dark:bg-slate-900">
                {/* Header top bar  */}
                <ChatHeader
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                />

                <div style={mainContentStyle}>
                    {/* Mobile Overlay */}
                    <div style={overlayStyle} onClick={() => setIsSidebarOpen(false)} />

                    {/* Left side bar */}
                    <div style={sidebarContainerStyle}>
                        <RoomSidebar
                            // rooms={mockRooms}
                            // currentUser={mockCurrentUser}
                            // // onCreateRoom={handleCreateRoom}
                            // // onJoinRoom={handleJoinRoom}
                            // // onOpenChat={handleOpenChat}

                            // onCreateRoom={() => { }}
                            // onJoinRoom={() => { }}
                            // onOpenChat={() => { }}

                            // selectedRoomId={selectedRoomId}
                            // isOpen={isSidebarOpen}
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </div>

                    {/* Right chat area , will be in outlet */}
                    {/* <div style={chatAreaStyle}> */}
                        <Outlet />
                    {/* </div> */}

                </div>


                {/* Footer, if any */}

            </div>
        </>
    )
};

export default Layout;