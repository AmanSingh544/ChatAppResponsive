import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { User, Room } from "@/types/chat";
import {
  X,
  Users,
  Crown,
  UserPlus,
  MessageCircle,
  Search
} from "lucide-react";

interface RoomMembersProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  currentUser: User;
  allUsers: User[];
  onAddMembers?: (user: []) => void;
  onRemoveMember?: (userId: string) => void;
  onPromoteMember?: (userId: string) => void;
}

export function RoomMembers({
  isOpen,
  onClose,
  room,
  currentUser,
  allUsers,
  onAddMembers,
  onRemoveMember,
  onPromoteMember,
}: RoomMembersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"members" | "add">("members");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const getThemeColors = () => {
    if (!mounted) {
      return {
        overlayBg: "rgba(0, 0, 0, 0.5)",
        modalBg: "#ffffff",
        textColor: "#374151",
        mutedText: "#6b7280",
        borderColor: "#e5e7eb",
        cardBg: "#f9fafb",
        inputBg: "#f9fafb",
      };
    }

    const isDark = theme === "dark";
    return {
      overlayBg: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
      modalBg: isDark ? "#1e293b" : "#ffffff",
      textColor: isDark ? "#f1f5f9" : "#374151",
      mutedText: isDark ? "#94a3b8" : "#6b7280",
      borderColor: isDark ? "#475569" : "#e5e7eb",
      cardBg: isDark ? "#334155" : "#f9fafb",
      inputBg: isDark ? "#334155" : "#f9fafb",
    };
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors = getThemeColors();


  const modalStyle: React.CSSProperties = {
    background: colors.modalBg,
    borderRadius: "16px",
    padding: "24px",
    width: "500px",
    minHeight: "68vh",
    maxHeight: "68vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: `1px solid ${colors.borderColor}`,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: colors.mutedText,
    cursor: "pointer",
    padding: "4px",
    borderRadius: "8px",
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: "flex",
    borderBottom: `1px solid ${colors.borderColor}`,
    marginBottom: "16px",
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "12px 16px",
    border: "none",
    borderBottom: isActive ? "2px solid #3b82f6" : "2px solid transparent",
    background: "transparent",
    color: isActive ? "#3b82f6" : colors.mutedText,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  });

  const searchStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px 10px 40px",
    border: `2px solid ${colors.borderColor}`,
    borderRadius: "8px",
    fontSize: "14px",
    background: colors.inputBg,
    color: colors.textColor,
    outline: "none",
  };
  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",

  };
  const addButtonStyle: React.CSSProperties = {
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };
  const memberItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginBottom: "8px",
  };
  const addMemberItemStyle: React.CSSProperties = {
    ...memberItemStyle,
    background: "#f0f9ff",
    border: "1px solid #0ea5e9",
  };
  const avatarStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    position: "relative",
  };

  const statusMarkerStyle = (status: string): React.CSSProperties => ({
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: getStatusColor(status),
    border: "2px solid white",
  });

  const filteredMembers = room.members.filter((member) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "#10b981";
      case "away":
        return "#f59e0b";
      case "offline":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "Online";
      case "away":
        return "Away";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: colors.overlayBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={headerStyle}
        >
          <h2
            style={titleStyle}
          >
            <Users size={20} />
            Room Management
          </h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div
          style={tabsContainerStyle}
        >
          <button
            style={tabStyle(activeTab === "members")}
            onClick={() => setActiveTab("members")}
          >
            <Users size={16} />
            Members
          </button>

          <button
            style={tabStyle(activeTab === "add")}
            onClick={() => setActiveTab("add")}
          >
            <UserPlus size={16} />
            Add Members
          </button>
        </div>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.mutedText,
            }}
          />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchStyle}
          />
        </div>

        <div >
          {activeTab === "members" ? (
            <div style={contentStyle}>
              {/* Members */}
              {filteredMembers.map((member) => (
                <div
                  key={member._id}
                  style={memberItemStyle}
                >
                  <div style={avatarStyle}> {getUserInitials(member.username)}
                    <div
                      style={statusMarkerStyle(member.status)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "600",
                        fontSize: "14px",
                        color: colors.textColor,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {member.username}
                      {member._id === currentUser._id && (
                        <span
                          style={{
                            fontSize: "11px",
                            color: colors.mutedText,
                          }}
                        >
                          (You)
                        </span>
                      )}
                      {member._id === room.members[0]._id && (
                        <Crown
                          size={12}
                          style={{ color: "#f59e0b" }}
                          title="Room Admin"
                        />
                      )}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "12px",
                        color: colors.mutedText,
                      }}
                    >
                      {getStatusText(member.status)}
                    </p>
                  </div>
                  <MessageCircle size={14} style={{ color: colors.mutedText }} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                style={contentStyle}
              >
                {/* <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "12px",
                }}
              >
                Suggested People
              </h4> */}
                {
                  allUsers.filter(user => room.members.every(roomU => user.username != roomU.username))?.map((user) => (
                    <div key={user._id} style={addMemberItemStyle}>
                      <div style={avatarStyle}>{getUserInitials(user.username)}
                        <div
                          style={statusMarkerStyle(user.status)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "#374151",
                          }}
                        >
                          {user.username}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          {getStatusText(user.status)}
                          {/* Online • Mutual: 3 rooms */}
                        </p>
                      </div>
                      <button style={addButtonStyle}>
                        <UserPlus size={12} />
                        Add
                      </button>
                    </div>
                  )
                  )
                }

              </div>
              <div style={{ textAlign: "center", color: colors.mutedText, padding: 0 }}>
                <p style={{ fontSize: "14px" }}>Suggested members will appear here.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
