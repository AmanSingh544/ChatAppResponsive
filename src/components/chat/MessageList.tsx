import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Message, User } from "@/types/chat";
import { Check, CheckCheck } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  roomMembers: User[];
}

function formatTime(date: Date) {
  date = typeof date === 'string' ? new Date(date) : date;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  date = typeof date === 'string' ? new Date(date) : date;
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = "";

  messages.forEach((message) => {
    const messageDate = formatDate(message.timestamp);
    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groups.push({ date: messageDate, messages: [message] });
    } else {
      groups[groups.length - 1].messages.push(message);
    }
  });

  return groups;
}

export function MessageList({
  messages,
  currentUser,
  roomMembers,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const groupedMessages = groupMessagesByDate(messages);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Get theme-aware colors
  const getThemeColors = () => {
    if (!mounted) {
      return {
        bg: "#ffffff",
        dateBg: "#f1f5f9",
        dateBorder: "#e2e8f0",
        ownBubbleBg: "#3b82f6",
        otherBubbleBg: "#f1f5f9",
        textColor: "#1f2937",
        mutedText: "#6b7280",
      };
    }

    const isDark = theme === "dark";
    return {
      bg: isDark
        ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
        : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      dateBg: isDark ? "#334155" : "#f1f5f9",
      dateBorder: isDark ? "#475569" : "#e2e8f0",
      ownBubbleBg: isDark ? "#2563eb" : "#3b82f6",
      otherBubbleBg: isDark ? "#374151" : "#f1f5f9",
      textColor: isDark ? "#f1f5f9" : "#1f2937",
      mutedText: isDark ? "#94a3b8" : "#6b7280",
      ownText: "#ffffff",
      otherText: isDark ? "#f1f5f9" : "#1f2937",
      borderColor: isDark ? "#475569" : "#e2e8f0",

    };
  };

  const colors = getThemeColors();

  // Styles - keeping original design but making colors theme-aware
  const containerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    height: "0", // Critical: This forces the flex item to respect the parent's height
    maxHeight: "100%", // Ensure it doesn't exceed parent
    background: colors.bg,
    position: "relative",
    contain: "layout style", // CSS containment for better performance
    scrollBehavior: "smooth",
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    padding: "20px",
    paddingBottom: "10px",
  };

  const spacerStyle: React.CSSProperties = {
    flex: 1,
    minHeight: "20px",
  };

  const messagesStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  };

  const dateSeparatorStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    margin: "16px 0",
    position: "sticky",
    top: "10px",
    zIndex: 10,
  };

  const dateBadgeStyle: React.CSSProperties = {
    background: colors.dateBg,
    color: colors.textColor,
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    border: `1px solid ${colors.dateBorder}`,
    backdropFilter: "blur(4px)",
  };

  const messageGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    marginBottom: "12px",
  };

  const messageRowStyle = (isOwn: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: isOwn ? "row-reverse" : "row",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "2px",
  });

  const avatarStyle = (num: number): React.CSSProperties => (
    {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      background: `linear-gradient(${num % 2}deg, ${["#ff7043", "#9c27b0", "#4CAF50", "#2196F3", "#009688"][num % 5]} 0%, #3b82f6 100%)`,
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "600",
      flexShrink: 0,
    });

  const messageContentStyle = (isOwn: boolean): React.CSSProperties => ({
    maxWidth: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: isOwn ? "flex-end" : "flex-start",
  });

  const senderNameStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "500",
    color: colors.mutedText,
    marginBottom: "2px",
    paddingLeft: "12px",
  };

  const messageBubbleStyle = (isOwn: boolean): React.CSSProperties => ({
    background: isOwn ? colors.ownBubbleBg : colors.otherBubbleBg,
    color: isOwn ? colors.ownText : colors.otherText,
    padding: "8px 12px",
    borderRadius: "18px",
    maxWidth: "100%",
    wordWrap: "break-word",
    position: "relative",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",

    minHeight: "36px", // Ensure enough space for time/status

  });

  return (
    <>
      <style>
        {`
          .message-list-container {
            /* Ensure proper scroll containment */
            overflow-anchor: auto;
            scroll-behavior: smooth;
            overscroll-behavior: contain;
          }

          .message-list-container::-webkit-scrollbar {
            width: 6px;
          }

          .message-list-container::-webkit-scrollbar-track {
            background: transparent;
          }

          .message-list-container::-webkit-scrollbar-thumb {
            background: ${colors.borderColor};
            border-radius: 3px;
          }

          .message-list-container::-webkit-scrollbar-thumb:hover {
            background: ${colors.mutedText};
          }
        `}
      </style>
      <div
        ref={containerRef}
        style={containerStyle}
        className="message-list-container"
        onScroll={(e) => e.stopPropagation()} // Prevent scroll bubbling
      >
        <div style={contentStyle}>
          <div style={spacerStyle} />

          <div style={messagesStyle}>
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date Separator */}
                <div style={dateSeparatorStyle}>
                  <div style={dateBadgeStyle}>{group.date}</div>
                </div>

                {/* Messages for this date */}
                <div style={messageGroupStyle}>
                  {group.messages.map((message, messageIndex) => {
                    const isOwn = message.senderId === currentUser._id;
                    const sender = roomMembers.find(
                      (member) => member._id === message.senderId,
                    );
                    const showAvatar =
                      !isOwn &&
                      (messageIndex === 0 ||
                        group.messages[messageIndex - 1].senderId !==
                        message.senderId);
                    const showSender =
                      !isOwn &&
                      (messageIndex === 0 ||
                        group.messages[messageIndex - 1].senderId !==
                        message.senderId);

                    return (
                      <div key={message._id} style={messageRowStyle(isOwn)}>
                        {/* Avatar (only for first message in group from others) */}
                        {!isOwn && (
                          <div style={{ width: "32px", flexShrink: 0 }}>
                            {showAvatar && (
                              <div style={avatarStyle(messageIndex * 10)}>
                                {sender?.username?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message Content */}
                        <div style={messageContentStyle(isOwn)}>
                          {/* Sender name (only for first message in group from others) */}
                          {showSender && (
                            <div style={senderNameStyle}>
                              {sender?.username || "Unknown User"}
                            </div>
                          )}

                          {/* Message Bubble with inline time/status */}
                          <div style={messageBubbleStyle(isOwn)}>
                            <div
                              style={{
                                fontSize: "14px",
                                lineHeight: "1.4",
                                whiteSpace: "pre-wrap",
                                paddingRight: "60px", // Space for time and status
                                minHeight: "20px",
                              }}
                            >
                              {message.content}
                            </div>
                            {/* Time and Status (inside bubble, bottom right) */}
                            <div
                              style={{
                                position: "absolute",
                                bottom: "4px",
                                right: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "11px",
                                color: isOwn
                                  ? "rgba(255, 255, 255, 0.8)"
                                  : colors.mutedText,
                                whiteSpace: "nowrap",
                                pointerEvents: "none",
                              }}
                            >
                              <span>{formatTime(message.timestamp)}</span>
                              {isOwn && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {message.status === "sent" && (
                                    <Check size={12} style={{ opacity: 0.8 }} />
                                  )}
                                  {message.status === "delivered" && (
                                    <Check size={12} style={{ opacity: 0.8 }} />
                                  )}
                                  {message.status === "read" && (
                                    <CheckCheck
                                      size={12}
                                      style={{ color: "#60a5fa", opacity: 1 }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 20px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      background: colors.dateBg,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <Check size={32} style={{ color: colors.mutedText }} />
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: colors.textColor,
                      margin: "0 0 4px",
                    }}
                  >
                    No messages yet
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: colors.mutedText,
                      margin: 0,
                    }}
                  >
                    Start the conversation by sending a message!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
}
