import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Room, Message, User } from "@/types/chat";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { RoomMembers } from "./RoomMembers";
import {
  UserPlus,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp,
  Users,
  Hash,
  Settings,
  Star,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface ChatAreaProps {
  room: Room | null;
  messages: Message[];
  currentUser: User;
  allUsers: User[];
  onSendMessage: (content: string) => void;
  onAddMembers: () => void;
}

const AVATAR_COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // green
  "#8b5cf6", // purple
  "#f97316", // orange
  "#ec4899", // pink
  "#6366f1", // indigo
  "#eab308", // yellow
];

function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ChatArea({
  room,
  messages,
  currentUser,
  allUsers,
  onSendMessage,
  onAddMembers,
}: ChatAreaProps) {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-hide header after 3 seconds (but not when members modal is open)
  useEffect(() => {
    if (room && isHeaderVisible && !isMembersModalOpen) {
      const timer = setTimeout(() => {
        setIsHeaderVisible(false);
        setIsHeaderExpanded(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [room, isHeaderVisible, isMembersModalOpen]);

  // Reset header visibility when room changes
  useEffect(() => {
    if (room) {
      setIsHeaderVisible(true);
      setIsHeaderExpanded(false);
    }
  }, [room?._id]);

  // Get theme-aware colors
  const getThemeColors = () => {
    if (!mounted) {
      return {
        bg: "#f8fafc",
        cardBg: "#ffffff",
        textColor: "#374151",
        mutedText: "#6b7280",
        borderColor: "#e5e7eb",
      };
    }

    const isDark = theme === "dark";
    return {
      bg: isDark
        ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      cardBg: isDark ? "#334155" : "#ffffff",
      textColor: isDark ? "#f1f5f9" : "#374151",
      mutedText: isDark ? "#94a3b8" : "#6b7280",
      borderColor: isDark ? "#475569" : "#e5e7eb",
    };
  };

  const colors = getThemeColors();

  if (!room) {
    const noRoomStyle: React.CSSProperties = {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: colors.bg,
    };

    const welcomeContainerStyle: React.CSSProperties = {
      textAlign: "center",
      color: colors.mutedText,
      padding: "40px",
    };

    const welcomeTitleStyle: React.CSSProperties = {
      fontSize: "24px",
      fontWeight: "600",
      margin: "0 0 8px",
      color: colors.textColor,
    };

    const welcomeTextStyle: React.CSSProperties = {
      fontSize: "16px",
      margin: 0,
      color: colors.mutedText,
    };

    return (
      <div style={noRoomStyle}>
        <div style={welcomeContainerStyle}>
          <MessageCircle
            size={64}
            style={{ margin: "0 auto 16px", color: "#a855f7" }}
          />
          <h3 style={welcomeTitleStyle}>Welcome to Chat</h3>
          <p style={welcomeTextStyle}>Select a room to start chatting</p>
        </div>
      </div>
    );
  }

  const getPurposeIcon = (purpose: string) => {
    switch (purpose) {
      case "chat":
        return <MessageCircle size={16} />;
      case "work":
        return <Settings size={16} />;
      case "education":
      case "study":
        return <Star size={16} />;
      case "gossip":
        return <Sparkles size={16} />;
      default:
        return <Hash size={16} />;
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case "chat":
        return "#3b82f6";
      case "work":
        return "#10b981";
      case "education":
      case "study":
        return "#f59e0b";
      case "gossip":
        return "#ec4899";
      default:
        return "#6b7280";
    }
  };

  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: colors.bg,
    height: "100%", // Ensure full height
    minHeight: 0, // Allow flex shrinking
  };

  const headerStyle: React.CSSProperties = {
    background: colors.cardBg,
    borderBottom: `1px solid ${colors.borderColor}`,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    overflow: "hidden",
  };

  const collapsedHeaderStyle: React.CSSProperties = {
    background: colors.cardBg,
    borderBottom: `1px solid ${colors.borderColor}`,
    padding: "8px 24px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const expandedHeaderStyle: React.CSSProperties = {
    ...headerStyle,
    padding: "16px 24px",
  };

  const headerMainStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const roomInfoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const roomIconStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: `linear-gradient(135deg, ${getPurposeColor(room.purpose)}20, ${getPurposeColor(room.purpose)}10)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: getPurposeColor(room.purpose),
  };

  const roomDetailsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const roomNameStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "600",
    color: colors.textColor,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const roomMetaStyle: React.CSSProperties = {
    fontSize: "13px",
    color: colors.mutedText,
    margin: "2px 0 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const headerActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const actionButtonStyle: React.CSSProperties = {
    background: colors.cardBg,
    border: `1px solid ${colors.borderColor}`,
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.textColor,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const expandButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: colors.mutedText,
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "color 0.2s ease",
  };

  const expandedContentStyle: React.CSSProperties = {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: `1px solid ${colors.borderColor}`,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: colors.textColor,
    margin: "0 0 8px",
  };

  const sectionContentStyle: React.CSSProperties = {
    fontSize: "13px",
    color: colors.mutedText,
    lineHeight: "1.5",
  };

  const membersListStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  };

  const memberBadgeStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: colors.borderColor,
    borderRadius: "16px",
    padding: "4px 8px",
    fontSize: "12px",
    color: colors.textColor,
  };

  const memberAvatarStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "600",
  };

  return (
    <div style={containerStyle}>
      {/* Chat Header */}
      {isHeaderVisible ? (
        <div style={expandedHeaderStyle}>
          <div style={headerMainStyle}>
            <div style={roomInfoStyle}>
              <div style={roomIconStyle}>{getPurposeIcon(room.purpose)}</div>
              <div style={roomDetailsStyle}>
                <h2 style={roomNameStyle}>
                  {room.name}
                  {room.isPrivate ? (
                    <Lock size={16} style={{ color: colors.mutedText }} />
                  ) : (
                    <Globe size={16} style={{ color: colors.mutedText }} />
                  )}
                  <span
                    style={{
                      background: getPurposeColor(room.purpose),
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "500",
                    }}
                  >
                    {room.purpose}
                  </span>
                </h2>
                <div style={roomMetaStyle}>
                  <Users size={14} />
                  <span>{room.members.length} members</span>
                  <span>•</span>
                  <span>{room.isPrivate ? "Private" : "Public"} room</span>
                </div>
              </div>
            </div>

            <div style={headerActionsStyle}>
              <button
                style={actionButtonStyle}
                onClick={() => setIsMembersModalOpen(true)}
              >
                <UserPlus size={16} />
                View Members
              </button>
              <button
                style={expandButtonStyle}
                onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
              >
                {isHeaderExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>
          </div>

          {isHeaderExpanded && (
            <div style={expandedContentStyle}>
              <div>
                <h4 style={sectionTitleStyle}>About this room</h4>
                <p style={sectionContentStyle}>
                  A {room.purpose} room for team collaboration and discussion.
                  {room.isPrivate
                    ? " This is a private room - only invited members can join."
                    : " This is a public room - anyone can join the conversation."}
                </p>
              </div>

              <div>
                <h4 style={sectionTitleStyle}>
                  Members ({room.members.length})
                </h4>
                <div style={membersListStyle}>
                  {room.members.slice(0, 6).map((member) => (
                    <div key={member._id} style={memberBadgeStyle}>
                      <div style={memberAvatarStyle}>
                        {getUserInitials(member.username)}
                      </div>
                      <span>{member.username}</span>
                    </div>
                  ))}
                  {room.members.length > 6 && (
                    <div style={memberBadgeStyle}>
                      <span>+{room.members.length - 6} more</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={collapsedHeaderStyle}
          onClick={() => setIsHeaderVisible(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.borderColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.cardBg;
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ ...roomIconStyle, width: "24px", height: "24px" }}>
              {getPurposeIcon(room.purpose)}
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: colors.textColor,
              }}
            >
              {room.name}
            </span>
            <span
              style={{
                background: getPurposeColor(room.purpose),
                color: "white",
                padding: "1px 6px",
                borderRadius: "8px",
                fontSize: "9px",
                fontWeight: "500",
              }}
            >
              {room.purpose}
            </span>
          </div>
          <ChevronDown
            size={16}
            style={{
              color: colors.mutedText,
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      )}

      {/* Messages Area */}
      <MessageList
        messages={messages}
        currentUser={currentUser}
        roomMembers={room.members}
      />

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />

      {/* Room Members Modal */}
      <RoomMembers
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        room={room}
        currentUser={currentUser}
        allUsers={allUsers}
        onAddMembers={onAddMembers}
        onRemoveMember={(userId) => {
          // In a real app, this would remove the member from the room
          console.log("Remove member:", userId);
        }}
        onPromoteMember={(userId) => {
          // In a real app, this would promote the member to admin
          console.log("Promote member:", userId);
        }}
      />
    </div>
  );
}
