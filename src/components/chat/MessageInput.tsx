import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Smile, Send, Paperclip, Image, Mic } from "lucide-react";
import Picker from "emoji-picker-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of 120px
    textarea.style.height = `${newHeight}px`;
  };

  // Get theme-aware colors
  const getThemeColors = () => {
    if (!mounted) {
      return {
        containerBg: "#ffffff",
        inputRowBg: "#f9fafb",
        textColor: "#1f2937",
        borderColor: "#e5e7eb",
        buttonColor: "#6b7280",
        sendBg: "#667eea",
      };
    }

    const isDark = theme === "dark";
    return {
      containerBg: isDark ? "#1e293b" : "#ffffff",
      inputRowBg: isDark ? "#334155" : "#f9fafb",
      textColor: isDark ? "#f1f5f9" : "#1f2937",
      borderColor: isDark ? "#475569" : "#e5e7eb",
      buttonColor: isDark ? "#94a3b8" : "#6b7280",
      sendBg: isDark ? "#2563eb" : "#667eea",
      placeholderColor: isDark ? "#64748b" : "#9ca3af",
    };
  };

  const colors = getThemeColors();

  // Styles - keeping original design but making colors theme-aware
  const containerStyle: React.CSSProperties = {
    background: colors.containerBg,
    borderTop: `1px solid ${colors.borderColor}`,
    padding: "16px 20px",
    boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)",
  };

  const inputRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    background: colors.inputRowBg,
    borderRadius: "16px",
    padding: "8px",
    border: `1px solid ${colors.borderColor}`,
    transition: "all 0.2s ease",
  };

  const leftActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const actionButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    padding: "8px",
    color: colors.buttonColor,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    resize: "none",
    fontSize: "14px",
    lineHeight: "1.4",
    padding: "8px 4px",
    fontFamily: "inherit",
    color: colors.textColor,
    maxHeight: "120px",
    minHeight: "40px",
  };

  const sendButtonStyle: React.CSSProperties = {
    background: message.trim() ? colors.sendBg : colors.borderColor,
    border: "none",
    borderRadius: "12px",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: message.trim() ? "pointer" : "not-allowed",
    transition: "all 0.2s ease",
    color: message.trim() ? "white" : colors.buttonColor,
    boxShadow: message.trim() ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "none",
  };

  const recordButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    color: isRecording ? "#ef4444" : colors.buttonColor,
    background: isRecording ? "rgba(239, 68, 68, 0.1)" : "transparent",
  };

  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  return (
    <div style={containerStyle}>
      <div
        style={inputRowStyle}
        onFocus={() => {
          if (textareaRef.current) {
            Object.assign(textareaRef.current.parentElement!.style, {
              borderColor: "#3b82f6",
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
            });
          }
        }}
        onBlur={() => {
          if (textareaRef.current) {
            Object.assign(textareaRef.current.parentElement!.style, {
              borderColor: colors.borderColor,
              boxShadow: "none",
            });
          }
        }}
      >
        {/* Left Actions */}
        <div style={leftActionsStyle}>
          <button
            style={actionButtonStyle}
            disabled={disabled}
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>
          <button
            style={actionButtonStyle}
            disabled={disabled}
            onClick={() => setShowPicker((prev) => !prev)}
            title="Add emoji"
          >
            <Smile size={18} />
          </button>
          {showPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "15rem",
                left: "20rem",
                // boxShadow: 3,
              }}
            >
              <div
                style={{
                  transform: `scale(${0.7})`,
                  transformOrigin: "top left",
                  display: "inline-block",
                }}
              >
                <div style={{ maxHeight: "10rem" }}>
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              </div>
            </div>
          )}
          <button
            style={actionButtonStyle}
            disabled={disabled}
            title="Add image"
          >
            <Image size={18} />
          </button>
        </div>

        {/* Message Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Chat is disabled" : "Type a message..."}
          disabled={disabled}
          style={{
            ...textareaStyle,
            // Custom placeholder styling using CSS
          }}
        />

        {/* Right Actions */}
        <div style={leftActionsStyle}>
          {!message.trim() && (
            <>
              <button
                style={recordButtonStyle}
                onClick={() => setIsRecording(!isRecording)}
                disabled={disabled}
                title={isRecording ? "Stop recording" : "Voice message"}
              >
                <Mic size={18} />
              </button>
            </>
          )}

          {/* Send Button */}
          <button
            style={sendButtonStyle}
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Add custom CSS for placeholder styling */}
      <style>
        {`
          textarea::placeholder {
            color: ${colors.placeholderColor};
          }
          
          .action-button:hover {
            background: ${colors.borderColor} !important;
            transform: scale(1.05);
          }
          
          .send-button:hover {
            transform: ${message.trim() ? "scale(1.05)" : "none"};
            box-shadow: ${
              message.trim() ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "none"
            } !important;
          }
        `}
      </style>
    </div>
  );
}
