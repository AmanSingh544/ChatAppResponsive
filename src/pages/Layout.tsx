import { ChatHeader } from "@/components/chat/ChatHeader";
import { RoomSidebar } from "@/components/chat/RoomSidebar";
import { Room, User } from "@/types/chat";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

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
              isOpen={isSidebarOpen}
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
  );
};

export default Layout;
