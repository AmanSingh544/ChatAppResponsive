import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Room, User } from "@/types/chat";
import {
  Search,
  Globe,
  Lock,
  Users,
  MessageCircle,
  Settings,
  Star,
  Sparkles,
  Hash,
  UserPlus,
  X,
} from "lucide-react";

interface RoomDiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
  currentUser: User;
  // In a real app, this would come from an API
  availableRooms?: Room[];
}


export function RoomDiscovery({
  isOpen,
  onClose,
  onJoinRoom,
  currentUser,
  availableRooms
}: RoomDiscoveryProps) {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("all");
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
    };
  };

  const colors = getThemeColors();

  const filteredRooms = availableRooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPurpose =
      selectedPurpose === "all" || room.purpose.toLowerCase() === selectedPurpose;
    return matchesSearch && matchesPurpose;//&& !room.isPrivate; // Only show public rooms
  });

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

  const handleJoinRoom = (roomId: string) => {
    onJoinRoom(roomId);
    onClose();
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
    maxWidth: "600px",
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
    marginBottom: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "600",
    color: colors.textColor,
    margin: 0,
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
    marginBottom: "16px",
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px 12px 44px",
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
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.mutedText,
  };

  const filtersStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };

  const filterButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    border: `2px solid ${isSelected ? "#3b82f6" : colors.borderColor}`,
    borderRadius: "6px",
    background: isSelected ? "#3b82f610" : colors.inputBg,
    color: isSelected ? "#3b82f6" : colors.textColor,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "12px",
    fontWeight: "500",
  });

  const roomsListStyle: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const roomCardStyle: React.CSSProperties = {
    padding: "16px",
    background: colors.cardBg,
    border: `1px solid ${colors.borderColor}`,
    borderRadius: "8px",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  const roomHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  };

  const roomTitleStyle: React.CSSProperties = {
    //  display: "flex",
    // alignItems: "center",
    // gap: "8px",
    fontSize: "16px",
    fontWeight: "600",
    color: colors.textColor,
    margin: 0,
    textWrapStyle: "pretty"
  };

  const roomMetaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "12px",
    color: colors.mutedText,
  };

  const joinButtonStyle: React.CSSProperties = {
    padding: "6px 12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    // display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Join a Room</h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.borderColor;
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
            placeholder="Search public rooms..."
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

        {/* Filters */}
        <div style={filtersStyle}>
          <button
            style={filterButtonStyle(selectedPurpose === "all")}
            onClick={() => setSelectedPurpose("all")}
          >
            All
          </button>
          <button
            style={filterButtonStyle(selectedPurpose === "chat")}
            onClick={() => setSelectedPurpose("chat")}
          >
            Chat
          </button>
          <button
            style={filterButtonStyle(selectedPurpose === "work")}
            onClick={() => setSelectedPurpose("work")}
          >
            Work
          </button>
          <button
            style={filterButtonStyle(selectedPurpose === "education")}
            onClick={() => setSelectedPurpose("education")}
          >
            Education
          </button>
          <button
            style={filterButtonStyle(selectedPurpose === "gossip")}
            onClick={() => setSelectedPurpose("gossip")}
          >
            Gossip
          </button>
        </div>

        {/* Rooms List */}
        <div style={roomsListStyle}>
          {filteredRooms && filteredRooms.length > 0 ? (filteredRooms.map((room) => (
            <div
              key={room._id}
              style={roomCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = getPurposeColor(
                  room.purpose,
                );
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.borderColor;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={roomHeaderStyle}>
                <h3 style={roomTitleStyle}>
                  <div style={{ color: getPurposeColor(room.purpose) }}>
                  {getPurposeIcon(room.purpose.toLowerCase())}
                  </div>
                  {room.name}
                </h3>
                <h3 >
                  {room.purpose.toLowerCase() === "public" ? <Globe size={14} style={{ color: colors.mutedText }} />
                    : <Lock size={14} style={{ color: colors.mutedText }} />}
                </h3>
                <button
                  style={joinButtonStyle}
                  onClick={() => handleJoinRoom(room._id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#3b82f6";
                  }}
                >
                  <UserPlus size={12} />
                  Join
                </button>
              </div>
              <div style={roomMetaStyle}>
                <span
                  style={{
                    background: getPurposeColor(room.purpose),
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "500",
                  }}
                >
                  {room.purpose}
                </span>
                <span>
                  <Users size={12} style={{ marginRight: "4px" }} />
                  {room.members.length} members
                </span>
                <span>{room.isPrivate ? "Private" : "Public"}</span>
              </div>
            </div>
          )))
            : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: colors.mutedText,
                }}
              >
                <Globe
                  size={48}
                  style={{ margin: "0 auto 16px", opacity: 0.5 }}
                />
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
                  No public rooms found
                </p>
                <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                  Try adjusting your search or create a new room
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
