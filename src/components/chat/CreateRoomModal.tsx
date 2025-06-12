import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { RoomCreationData, PURPOSE_OPTIONS } from "@/types/chat";
import {
  X,
  Hash,
  Lock,
  Globe,
  Users,
  MessageCircle,
  Settings,
  Star,
  Sparkles,
} from "lucide-react";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: RoomCreationData) => void;
}

export function CreateRoomModal({
  isOpen,
  onClose,
  onCreateRoom,
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("");
  const [purpose, setPurpose] = useState<string>("chat");
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState("");
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
      inputBg: isDark ? "#334155" : "#f9fafb",
    };
  };

  const colors = getThemeColors();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      onCreateRoom({
        name: roomName.trim(),
        purpose,
        isPrivate,
        description: description.trim(),
      });
      setRoomName("");
      setPurpose("chat");
      setIsPrivate(false);
      setDescription("");
      onClose();
    }
  };

  const getPurposeIcon = (purposeType: string) => {
    switch (purposeType) {
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

  const getPurposeColor = (purposeType: string) => {
    switch (purposeType) {
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
    maxHeight: "90vh",
    overflow: "auto",
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

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: colors.textColor,
  };

  const inputStyle: React.CSSProperties = {
    padding: "12px 16px",
    border: `2px solid ${colors.borderColor}`,
    borderRadius: "8px",
    fontSize: "14px",
    background: colors.inputBg,
    color: colors.textColor,
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit",
  };

  const purposeGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
  };

  const purposeButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: "12px 16px",
    border: `2px solid ${isSelected ? getPurposeColor(purpose) : colors.borderColor}`,
    borderRadius: "8px",
    background: isSelected ? `${getPurposeColor(purpose)}10` : colors.inputBg,
    color: isSelected ? getPurposeColor(purpose) : colors.textColor,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
  });

  const privacyToggleStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
  };

  const privacyButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "12px 16px",
    border: `2px solid ${isSelected ? "#3b82f6" : colors.borderColor}`,
    borderRadius: "8px",
    background: isSelected ? "#3b82f610" : colors.inputBg,
    color: isSelected ? "#3b82f6" : colors.textColor,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
  });

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  };

  const buttonStyle = (
    variant: "primary" | "secondary",
  ): React.CSSProperties => ({
    flex: 1,
    padding: "12px 24px",
    border: variant === "primary" ? "none" : `2px solid ${colors.borderColor}`,
    borderRadius: "8px",
    background: variant === "primary" ? "#3b82f6" : colors.inputBg,
    color: variant === "primary" ? "white" : colors.textColor,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Create New Room</h2>
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

        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Room Name *</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name..."
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.borderColor;
              }}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Purpose</label>
            <div style={purposeGridStyle}>
              {PURPOSE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  style={purposeButtonStyle(purpose === option)}
                  onClick={() => setPurpose(option)}
                  onMouseEnter={(e) => {
                    if (purpose !== option) {
                      e.currentTarget.style.borderColor =
                        getPurposeColor(option);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (purpose !== option) {
                      e.currentTarget.style.borderColor = colors.borderColor;
                    }
                  }}
                >
                  {getPurposeIcon(option)}
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Privacy</label>
            <div style={privacyToggleStyle}>
              <button
                type="button"
                style={privacyButtonStyle(!isPrivate)}
                onClick={() => setIsPrivate(false)}
              >
                <Globe size={16} />
                Public
              </button>
              <button
                type="button"
                style={privacyButtonStyle(isPrivate)}
                onClick={() => setIsPrivate(true)}
              >
                <Lock size={16} />
                Private
              </button>
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this room is for..."
              style={textareaStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.borderColor;
              }}
            />
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              style={buttonStyle("secondary")}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.borderColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.inputBg;
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={buttonStyle("primary")}
              disabled={!roomName.trim()}
              onMouseEnter={(e) => {
                if (roomName.trim()) {
                  e.currentTarget.style.background = "#2563eb";
                }
              }}
              onMouseLeave={(e) => {
                if (roomName.trim()) {
                  e.currentTarget.style.background = "#3b82f6";
                }
              }}
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
