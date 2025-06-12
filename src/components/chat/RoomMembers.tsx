import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { User, Room } from "@/types/chat";
import {
  X,
  Users,
  Crown,
  UserPlus,
  UserMinus,
  Mail,
  MessageCircle,
  MoreVertical,
  Search,
  Shield,
  Settings,
} from "lucide-react";

interface RoomMembersProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  currentUser: User;
  onAddMembers?: () => void;
  onRemoveMember?: (userId: string) => void;
  onPromoteMember?: (userId: string) => void;
}

export function RoomMembers({
  isOpen,
  onClose,
  room,
  currentUser,
  onAddMembers,
  onRemoveMember,
  onPromoteMember,
}: RoomMembersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      hoverBg: isDark ? "#475569" : "#e5e7eb",
    };
  };

  const colors = getThemeColors();

  const filteredMembers = room.members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const getUserColor = (userId: string) => {
    const colors = [
      "from-red-400 to-red-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-orange-400 to-orange-600",
      "from-pink-400 to-pink-600",
    ];
    const index = userId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: colors.overlayBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  };

  const modalStyle: React.CSSProperties = {
    background: colors.modalBg,
    borderRadius: "16px",
    padding: "24px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "80vh",
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
    color: colors.textColor,
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
    transition: "all 0.2s ease",
  };

  const searchContainerStyle: React.CSSProperties = {
    position: "relative",
    marginBottom: "20px",
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px 10px 40px",
    border: `2px solid ${colors.borderColor}`,
    borderRadius: "8px",
    fontSize: "14px",
    background: colors.inputBg,
    color: colors.textColor,
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const searchIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.mutedText,
  };

  const membersListStyle: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const memberCardStyle: React.CSSProperties = {
    padding: "12px",
    background: colors.cardBg,
    border: `1px solid ${colors.borderColor}`,
    borderRadius: "8px",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  const memberMainStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const avatarStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
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

  const statusDotStyle = (status: User["status"]): React.CSSProperties => ({
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: getStatusColor(status),
    border: "2px solid white",
  });

  const memberInfoStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const memberNameStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: colors.textColor,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const memberStatusStyle: React.CSSProperties = {
    fontSize: "12px",
    color: colors.mutedText,
    margin: "2px 0 0",
  };

  const memberActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const actionButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: colors.mutedText,
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const addButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "16px",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <Users size={20} />
            Room Members ({room.members.length})
          </h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={searchContainerStyle}>
          <Search size={16} style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.borderColor;
            }}
          />
        </div>

        {/* Members List */}
        <div style={membersListStyle}>
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              style={memberCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.cardBg;
              }}
            >
              <div style={memberMainStyle}>
                <div style={avatarStyle}>
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    getUserInitials(member.name)
                  )}
                  <div style={statusDotStyle(member.status)}></div>
                </div>

                <div style={memberInfoStyle}>
                  <p style={memberNameStyle}>
                    {member.name}
                    {member.id === currentUser.id && (
                      <span
                        style={{ fontSize: "11px", color: colors.mutedText }}
                      >
                        (You)
                      </span>
                    )}
                    {member.id === room.members[0].id && (
                      <Crown
                        size={12}
                        style={{ color: "#f59e0b" }}
                        title="Room Admin"
                      />
                    )}
                  </p>
                  <p style={memberStatusStyle}>
                    {getStatusText(member.status)}
                  </p>
                </div>

                <div style={memberActionsStyle}>
                  <button
                    style={actionButtonStyle}
                    title="Send message"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.borderColor;
                      e.currentTarget.style.color = "#3b82f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = colors.mutedText;
                    }}
                  >
                    <MessageCircle size={14} />
                  </button>

                  {member.id !== currentUser.id && (
                    <button
                      style={actionButtonStyle}
                      title="More options"
                      onClick={() =>
                        setSelectedMember(
                          selectedMember === member.id ? null : member.id,
                        )
                      }
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.borderColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <MoreVertical size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Member Actions Dropdown */}
              {selectedMember === member.id && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    background: colors.inputBg,
                    borderRadius: "6px",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {member.id !== room.members[0].id && (
                    <button
                      style={{
                        padding: "4px 8px",
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onClick={() => onPromoteMember?.(member.id)}
                    >
                      <Shield size={12} />
                      Promote
                    </button>
                  )}
                  <button
                    style={{
                      padding: "4px 8px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onClick={() => onRemoveMember?.(member.id)}
                  >
                    <UserMinus size={12} />
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: colors.mutedText,
              }}
            >
              <Users
                size={40}
                style={{ margin: "0 auto 12px", opacity: 0.5 }}
              />
              <p style={{ margin: 0, fontSize: "14px" }}>No members found</p>
            </div>
          )}
        </div>

        {/* Add Members Button */}
        {onAddMembers && (
          <button
            style={addButtonStyle}
            onClick={onAddMembers}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#3b82f6";
            }}
          >
            <UserPlus size={16} />
            Add More Members
          </button>
        )}
      </div>
    </div>
  );
}
