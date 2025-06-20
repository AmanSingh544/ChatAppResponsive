import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { Room, RoomCreationData, PURPOSE_OPTIONS, User } from "@/types/chat";
import { CreateRoomModal } from "./CreateRoomModal";
import { RoomDiscovery } from "./RoomDiscovery";
import {
  Hash,
  Lock,
  Globe,
  Users,
  MessageCircle,
  Settings,
  Search,
  Star,
  X,
  Filter,
  Sparkles,
  Clock,
  Plus,
} from "lucide-react";
import { getClientId } from "@/lib/clientId";
import { useApiWithToast } from "@/hooks/useApiWithToast";
import { roomsApi } from "@/api/roomApi";
import { useNavigate } from 'react-router-dom';

interface RoomSidebarProps {
  // rooms: Room[];
  // currentUser: User;
  // onCreateRoom: (roomData: RoomCreationData) => void;
  // onJoinRoom: (roomId: string) => void;
  // onOpenChat: (roomId: string) => void;
  // selectedRoomId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function RoomSidebar({
  isOpen = true,
  onClose,
}: RoomSidebarProps) {
  const { callApi } = useApiWithToast();
  const currentUser = useRef(getClientId())?.current;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">(
    "all",
  );
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

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

  const fetchAvailableRooms = useCallback(async () => {
    const response = await callApi(() => roomsApi.getAvailableRooms(), {
      successMessage: "Available Room fetched successfully!",
      errorMessage: "Failed to fetch Available room",
      onSuccess: () => console.log("Available Room was fetched successfully"),
      onError: (err) => console.error("Failed to fetch room", err),

    });
    if (response.success && response.data) {
      setAvailableRooms(response?.data)
      console.log("Available Room Details:", response.data); // response.data is Room
    }
  }, []);

  const handleCreateRoom = useCallback(async (roomDataPayload: RoomCreationData) => {
    const response = await callApi(() => roomsApi.createRoom(roomDataPayload), {
      successMessage: "Room created successfully!",
      errorMessage: "Failed to create room",
      onSuccess: () => console.log("Room was created successfully"),
    });
    if (response.success && response.data) {
      setRooms(response?.data)
      console.log("Created Room:", response.data); // response.data is Room
    };
  }, []);

  const handleJoinRoom = useCallback(async (roomId: string) => {
    const response = await callApi(() => roomsApi.joinRoom(roomId), {
      successMessage: "Joined room successfully!",
      errorMessage: "Failed to join room",
      onSuccess: () => console.log("Joined Room successfully"),
    });
    if (response.success && response.data) {
      setSelectedRoomId(roomId);
      console.log("Joined Room:", response.data); // response.data is Room
      setRooms(prev => [...prev, response.data]);
      setAvailableRooms(prev => prev.filter(pr => pr._id !== response.data._id));
    };
  }, []);

  const handleOpenChat = (roomId: string) => {
    setSelectedRoomId(roomId);
    navigate(`/dashboard/chat/${roomId}`, { state: { roomId: roomId } });

  };

  useEffect(() => {
    setMounted(true);
    getAllRooms();
    fetchAvailableRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "public" && !room.isPrivate) ||
      (filterType === "private" && room.isPrivate);
    return matchesSearch && matchesFilter;
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

  const getLastActivity = (room: Room) => {
    // Mock last activity - in real app this would come from room data
    const activities = [
      "2 minutes ago",
      "5 minutes ago",
      "1 hour ago",
      "3 hours ago",
      "Yesterday",
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  // Get theme-aware colors
  const getThemeColors = () => {
    if (!mounted) {
      return {
        sidebarBg: "#ffffff",
        headerBg: "#667eea",
        searchBg: "#ffffff",
        cardBg: "#ffffff",
        textColor: "#374151",
        borderColor: "#e2e8f0",
      };
    }

    const isDark = theme === "dark";
    return {
      sidebarBg: isDark ? "#1e293b" : "#ffffff",
      headerBg: isDark
        ? "linear-gradient(135deg, #475569 0%, #334155 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      searchBg: isDark ? "#334155" : "#ffffff",
      cardBg: isDark ? "#334155" : "#ffffff",
      textColor: isDark ? "#f1f5f9" : "#374151",
      borderColor: isDark ? "#475569" : "#e2e8f0",
      mutedText: isDark ? "#94a3b8" : "#6b7280",
    };
  };

  const colors = getThemeColors();

  // Styles - keeping original design but making colors theme-aware
  const sidebarStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: `linear-gradient(180deg, ${colors.sidebarBg} 0%, ${colors.sidebarBg} 100%)`,
    borderRight: `1px solid ${colors.borderColor}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
  };

  const headerStyle: React.CSSProperties = {
    padding: "10px",
    borderBottom: `1px solid ${colors.borderColor}`,
    background: colors.headerBg,
    color: "white",
    position: "relative",
  };

  const headerTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const headerSubtitleStyle: React.CSSProperties = {
    fontSize: "13px",
    margin: 0,
    marginTop: "4px",
    color: "rgba(255, 255, 255, 0.8)",
  };

  const searchSectionStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: `1px solid ${colors.borderColor}`,
    background: colors.searchBg,
  };

  const searchContainerStyle: React.CSSProperties = {
    position: "relative",
    marginBottom: "12px",
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px 10px 40px",
    border: `2px solid ${colors.borderColor}`,
    borderRadius: "12px",
    fontSize: "14px",
    background: colors.searchBg,
    transition: "all 0.2s ease",
    outline: "none",
    color: colors.textColor,
  };

  const searchIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.mutedText,
  };

  const filterButtonsStyle: React.CSSProperties = {
    display: "flex",
    gap: "6px",
  };

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "500",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: isActive ? "#3b82f6" : colors.borderColor,
    color: isActive ? "white" : colors.mutedText,
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
    padding: "0 0 20px",
  };

  const roomCardStyle = (
    isSelected: boolean,
    isHovered: boolean,
  ): React.CSSProperties => ({
    padding: "12px 20px",
    borderBottom: `1px solid ${colors.borderColor}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: isSelected
      ? "rgba(59, 130, 246, 0.1)"
      : isHovered
        ? colors.borderColor
        : colors.cardBg,
    borderLeft: isSelected ? "4px solid #3b82f6" : "4px solid transparent",
  });

  const roomNameStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: colors.textColor,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const roomDetailsStyle: React.CSSProperties = {
    fontSize: "12px",
    color: colors.mutedText,
    margin: "4px 0 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const roomMetaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "6px",
  };

  const membersStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: colors.mutedText,
  };

  const lastActivityStyle: React.CSSProperties = {
    fontSize: "11px",
    color: colors.mutedText,
  };

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Hash size={20} />
          <div>
            <h2 style={headerTitleStyle}>Rooms</h2>
            <p style={headerSubtitleStyle}>
              {rooms.length} room{rooms.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
        {onClose && (
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
            }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div style={searchSectionStyle}>
        <div style={searchContainerStyle}>
          <Search size={16} style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <div style={filterButtonsStyle}>
          <button
            style={filterButtonStyle(filterType === "all")}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          <button
            style={filterButtonStyle(filterType === "public")}
            onClick={() => setFilterType("public")}
          >
            <Globe size={12} style={{ marginRight: "4px" }} />
            Public
          </button>
          <button
            style={filterButtonStyle(filterType === "private")}
            onClick={() => setFilterType("private")}
          >
            <Lock size={12} style={{ marginRight: "4px" }} />
            Private
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div style={contentStyle}>
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            style={roomCardStyle(
              selectedRoomId === room._id,
              hoveredRoom === room._id,
            )}
            onClick={() => handleOpenChat(room._id)}
            onMouseEnter={() => setHoveredRoom(room._id)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <div style={roomNameStyle}>
              <div style={{ color: getPurposeColor(room.purpose) }}>
                {getPurposeIcon(room.purpose)}
              </div>
              {room.name}
              {room.isPrivate ? (
                <Lock size={12} style={{ color: colors.mutedText }} />
              ) : (
                <Globe size={12} style={{ color: colors.mutedText }} />
              )}
            </div>

            <div style={roomDetailsStyle}>
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
            </div>

            <div style={roomMetaStyle}>
              <div style={membersStyle}>
                <Users size={12} style={{ color: colors.mutedText }} />
                <span style={{ fontSize: "11px", color: colors.mutedText }}>
                  {room.members.length} member
                  {room.members.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div style={lastActivityStyle}>
                <Clock size={10} style={{ marginRight: "2px" }} />
                {getLastActivity(room)}
              </div>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: colors.mutedText,
            }}
          >
            <MessageCircle
              size={40}
              style={{ margin: "0 auto 12px", opacity: 0.5 }}
            />
            <p style={{ margin: 0, fontSize: "14px" }}>No rooms found</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
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
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
            onClick={() => setIsCreateModalOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(59, 130, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
          >
            <Plus size={16} />
            Create New Room
          </button>

          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              background: colors.cardBg,
              color: colors.textColor,
              border: `2px solid ${colors.borderColor}`,
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={() => setIsDiscoveryOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.background = "#3b82f610";
              e.currentTarget.style.color = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.borderColor;
              e.currentTarget.style.background = colors.cardBg;
              e.currentTarget.style.color = colors.textColor;
            }}
          >
            <Globe size={16} />
            Join Room
          </button>
        </div>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />

      {/* Room Discovery Modal */}
      <RoomDiscovery
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
        onJoinRoom={handleJoinRoom}
        currentUser={currentUser}
        availableRooms={availableRooms}
      />
    </div>
  );
}
