import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { User } from "@/types/chat";
import {
  User as UserIcon,
  Circle,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  BellOff,
  Moon,
  Sun,
  MoreVertical,
  Search,
  Users,
  Menu,
  X,
} from "lucide-react";

interface ChatHeaderProps {
  currentUser: User;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function ChatHeader({
  currentUser,
  isSidebarOpen = true,
  onToggleSidebar,
}: ChatHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Get theme-aware colors
  const getThemeColors = () => {
    if (!mounted) return { headerBg: "#4f46e5", dropdownBg: "#ffffff" }; // Default colors during SSR

    const isDark = theme === "dark";
    return {
      headerBg: isDark
        ? "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)"
        : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)",
      dropdownBg: isDark ? "#1e293b" : "#ffffff",
      dropdownText: isDark ? "#f1f5f9" : "#374151",
      dropdownBorder: isDark ? "#334155" : "#e5e7eb",
      searchBg: isDark ? "#334155" : "#f8fafc",
      searchBorder: isDark ? "#475569" : "#e2e8f0",
    };
  };

  const colors = getThemeColors();

  // Styles - keeping original design but making colors theme-aware
  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: colors.headerBg,
    color: "white",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
  };

  const leftSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const logoContainerStyle: React.CSSProperties = {
    position: "relative",
  };

  const logoStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    transition: "transform 0.2s ease",
  };

  const pulseDotStyle: React.CSSProperties = {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "12px",
    height: "12px",
    background: "#10b981",
    borderRadius: "50%",
    boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.3)",
    animation: "pulse 2s infinite",
  };

  const titleSectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "-0.025em",
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
    margin: 0,
    marginTop: "2px",
  };

  const rightSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const iconButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "white",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  const statusIndicatorStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    backdropFilter: "blur(8px)",
  };

  const statusDotStyle: React.CSSProperties = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: getStatusColor(currentUser.status),
    boxShadow: `0 0 0 2px rgba(${getStatusColor(currentUser.status)}, 0.3)`,
  };

  const userButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "white",
    padding: "4px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
  };

  const avatarStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    position: "relative",
  };

  const avatarStatusStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: getStatusColor(currentUser.status),
    border: "2px solid white",
    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.1)",
  };

  const userInfoStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    margin: 0,
    lineHeight: 1,
  };

  const userStatusStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
    margin: 0,
    marginTop: "2px",
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    background: colors.dropdownBg,
    backdropFilter: "blur(12px)",
    borderRadius: "12px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: `1px solid ${colors.dropdownBorder}`,
    minWidth: "220px",
    padding: "8px 0",
    zIndex: 100,
  };

  const dropdownHeaderStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: `1px solid ${colors.dropdownBorder}`,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const dropdownItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    color: colors.dropdownText,
    textDecoration: "none",
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontSize: "14px",
  };

  const searchBarStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    padding: "8px 12px 8px 36px",
    color: "white",
    fontSize: "14px",
    outline: "none",
  };

  const searchIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "28px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255, 255, 255, 0.6)",
  };

  const mobileHiddenStyle: React.CSSProperties = {
    display: window.innerWidth < 640 ? "none" : "flex",
  };

  const tabletHiddenStyle: React.CSSProperties = {
    display: window.innerWidth < 768 ? "none" : "flex",
  };

  const desktopHiddenStyle: React.CSSProperties = {
    display: window.innerWidth >= 1024 ? "none" : "flex",
  };

  return (
    <div style={headerStyle}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          
          .icon-button:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            transform: scale(1.05);
          }
          
          .user-button:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }
          
          .dropdown-item:hover {
            background: ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"} !important;
          }
          
          .logo:hover {
            transform: rotate(5deg);
          }
          
          .search-input:focus {
            border-color: rgba(255, 255, 255, 0.4);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
          }
          
          .search-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }

          @media (max-width: 640px) {
            .mobile-hidden { display: none !important; }
            .title-desktop { display: none !important; }
          }
          
          @media (max-width: 768px) {
            .tablet-hidden { display: none !important; }
          }
          
          @media (min-width: 1024px) {
            .desktop-hidden { display: none !important; }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Left Section - Logo & Title */}
        <div style={leftSectionStyle}>
          {/* Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              style={iconButtonStyle}
              className="icon-button"
              onClick={onToggleSidebar}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <div style={logoContainerStyle}>
            <div style={logoStyle} className="logo">
              <MessageSquare size={20} />
            </div>
            <div style={pulseDotStyle}></div>
          </div>

          <div style={titleSectionStyle}>
            <h1 style={titleStyle}>
              <span className="mobile-hidden">💬 Chat Dashboard</span>
              <span
                className="title-desktop"
                style={{ display: window.innerWidth >= 640 ? "none" : "block" }}
              >
                💬 Chat
              </span>
            </h1>
            <p style={subtitleStyle} className="mobile-hidden">
              Stay connected with your team
            </p>
          </div>
        </div>

        {/* Right Section - User Info & Controls */}
        <div style={rightSectionStyle}>
          {/* Search Button (Mobile/Tablet) */}
          <button
            style={iconButtonStyle}
            className="icon-button desktop-hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          {/* Notifications Toggle */}
          <button
            style={{
              ...iconButtonStyle,
              position: "relative",
            }}
            className="icon-button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            aria-label={
              notificationsEnabled
                ? "Disable notifications"
                : "Enable notifications"
            }
          >
            {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {notificationsEnabled && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  background: "#ef4444",
                  borderRadius: "50%",
                  animation: "pulse 1.5s infinite",
                }}
              ></div>
            )}
          </button>

          {/* User Status & Info */}
          <div
            style={{ ...statusIndicatorStyle, ...tabletHiddenStyle }}
            className="tablet-hidden"
          >
            <div style={statusDotStyle}></div>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              {getStatusText(currentUser.status)}
            </span>
          </div>

          {/* User Avatar & Menu */}
          <div style={{ position: "relative" }}>
            <button
              style={userButtonStyle}
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <div style={avatarStyle}>
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
                <div style={avatarStatusStyle}></div>
              </div>

              <div
                style={{ ...userInfoStyle, ...mobileHiddenStyle }}
                className="mobile-hidden"
              >
                <p style={userNameStyle}>{currentUser.name}</p>
                <p style={userStatusStyle}>
                  {getStatusText(currentUser.status)}
                </p>
              </div>

              <MoreVertical size={16} className="mobile-hidden" />
            </button>

            {showUserMenu && (
              <div style={dropdownStyle}>
                <div style={dropdownHeaderStyle}>
                  <div
                    style={{ ...avatarStyle, width: "32px", height: "32px" }}
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      currentUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: "500",
                        color: colors.dropdownText,
                      }}
                    >
                      {currentUser.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: theme === "dark" ? "#94a3b8" : "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Circle
                        size={8}
                        style={{
                          fill: getStatusColor(currentUser.status),
                          color: getStatusColor(currentUser.status),
                        }}
                      />
                      {getStatusText(currentUser.status)}
                    </p>
                  </div>
                </div>

                <div style={{ padding: "4px 0" }}>
                  <button style={dropdownItemStyle} className="dropdown-item">
                    <UserIcon size={16} />
                    Profile Settings
                  </button>

                  <button style={dropdownItemStyle} className="dropdown-item">
                    <Users size={16} />
                    Manage Teams
                  </button>

                  <button
                    style={dropdownItemStyle}
                    className="dropdown-item"
                    onClick={() =>
                      setNotificationsEnabled(!notificationsEnabled)
                    }
                  >
                    {notificationsEnabled ? (
                      <BellOff size={16} />
                    ) : (
                      <Bell size={16} />
                    )}
                    {notificationsEnabled ? "Disable" : "Enable"} Notifications
                  </button>

                  <button
                    style={dropdownItemStyle}
                    className="dropdown-item"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    {theme === "dark" ? "Light" : "Dark"} Mode
                  </button>

                  <button style={dropdownItemStyle} className="dropdown-item">
                    <Settings size={16} />
                    Settings
                  </button>

                  <div
                    style={{
                      height: "1px",
                      background: colors.dropdownBorder,
                      margin: "4px 0",
                    }}
                  ></div>

                  <button
                    style={{
                      ...dropdownItemStyle,
                      color: theme === "dark" ? "#ef4444" : "#dc2626",
                    }}
                    className="dropdown-item"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div style={searchBarStyle}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={searchIconStyle} />
            <input
              type="text"
              placeholder="Search conversations..."
              style={searchInputStyle}
              className="search-input"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}
