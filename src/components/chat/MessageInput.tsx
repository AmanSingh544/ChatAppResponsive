import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Smile, Send, Paperclip, Image, Mic } from "lucide-react";
import Picker from "emoji-picker-react";
import getCaretCoordinates from "textarea-caret";
import AvatarLogo from "./AvatarLogo"; // Assuming this is your custom component

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
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);

  // Mention dropdown states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [suggestionDropDownPosition, setSuggestionDropDownPosition] = useState({
    top: 0,
    left: 0,
  });

  const dummyMembers = ["john", "jane", "jack", "jill"];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      setShowSuggestions(false);
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

  const showSuggestionsAtCaret = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    const caretPosition = e.target.selectionStart;

    const lastAtIndex = value.lastIndexOf("@", caretPosition - 1);
    const hasValidTrigger =
      lastAtIndex !== -1 &&
      (lastAtIndex === 0 || /\s/.test(value[lastAtIndex - 1]));

    if (!hasValidTrigger) {
      setShowSuggestions(false);
      return;
    }

    const query = value.slice(lastAtIndex + 1, caretPosition);
    const filtered = dummyMembers.filter((name) =>
      name.toLowerCase().startsWith(query.toLowerCase()),
    );
    setFilteredMembers(filtered);

    const textarea = textareaRef.current;
    if (!textarea) return;

    const div = document.createElement("div");
    const computed = window.getComputedStyle(textarea);
    for (let prop of computed) {
      div.style.setProperty(prop, computed.getPropertyValue(prop));
    }

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.overflow = "hidden";
    div.style.height = `${textarea.scrollHeight}px`;
    div.style.width = `${textarea.offsetWidth}px`;

    const text = value.substring(0, caretPosition);
    div.textContent = text;

    const span = document.createElement("span");
    span.textContent = "\u200b";
    div.appendChild(span);
    document.body.appendChild(div);

    const coords = getCaretCoordinates(e.target, e.target.selectionStart);
    const rect = e.target.getBoundingClientRect();
    setSuggestionDropDownPosition({
      top: rect.top + coords.top + 25,
      left: coords.left,
    });

    //const rect = span.getBoundingClientRect();
    const parentRect = textarea.getBoundingClientRect();
    //const top = rect.top - parentRect.top + textarea.scrollTop;

    const bottom = 0;
    const left = 0; // rect.left - parentRect.left + textarea.scrollLeft;

    setSuggestionDropDownPosition({
      top: rect.top + coords.top + 25,
      left: coords.left,
    });
    setShowSuggestions(filtered.length > 0);

    document.body.removeChild(div);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
    showSuggestionsAtCaret(e);
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const colors = (() => {
    if (!mounted) {
      return {
        containerBg: "#ffffff",
        inputRowBg: "#f9fafb",
        textColor: "#1f2937",
        borderColor: "#e5e7eb",
        buttonColor: "#6b7280",
        sendBg: "#667eea",
        placeholderColor: "#9ca3af",
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
  })();

  return (
    <div
      style={{
        background: colors.containerBg,
        borderTop: `1px solid ${colors.borderColor}`,
        padding: "16px 20px",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          background: colors.inputRowBg,
          borderRadius: "16px",
          padding: "8px",
          border: `1px solid ${colors.borderColor}`,
          transition: "all 0.2s ease",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button style={buttonStyle(colors)} disabled={disabled}>
            <Paperclip size={18} />
          </button>
          <button
            style={buttonStyle(colors)}
            disabled={disabled}
            onClick={() => setShowPicker((p) => !p)}
          >
            <Smile size={18} />
          </button>
          {showPicker && (
            <div
              style={{ position: "absolute", bottom: "15rem", left: "20rem" }}
            >
              <div
                style={{
                  transform: `scale(0.7)`,
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
          <button style={buttonStyle(colors)} disabled={disabled}>
            <Image size={18} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Chat is disabled" : "Type a message..."}
          disabled={disabled}
          style={{
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
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {!message.trim() && (
            <button
              style={{
                ...buttonStyle(colors),
                color: isRecording ? "#ef4444" : colors.buttonColor,
                background: isRecording
                  ? "rgba(239, 68, 68, 0.1)"
                  : "transparent",
              }}
              onClick={() => setIsRecording(!isRecording)}
              disabled={disabled}
            >
              <Mic size={18} />
            </button>
          )}
          <button
            style={{
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
              boxShadow: message.trim()
                ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                : "none",
            }}
            onClick={handleSend}
            disabled={!message.trim() || disabled}
          >
            <Send size={18} />
          </button>
        </div>

        {showSuggestions && (
          <div
            style={{
              position: "absolute",
              top: suggestionDropDownPosition.top + 30,
              left: suggestionDropDownPosition.left + 10,
              zIndex: 999,
              background: colors.containerBg,
              borderRadius: "8px",
              border: `1px solid ${colors.borderColor}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              maxHeight: "150px",
              overflowY: "auto",
              width: "200px",
            }}
          >
            {filteredMembers.length > 0 ? (
              filteredMembers.map((name, index) => (
                <div
                  key={index}
                  onMouseDown={() => {
                    setMessage((prev) => prev.replace(/@\w*$/, `@${name} `));
                    setShowSuggestions(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: `1px solid ${colors.borderColor}`,
                    fontSize: "14px",
                    color: colors.textColor,
                  }}
                >
                  <AvatarLogo
                    avatarText={name[0]}
                    index={index}
                    tooltipTitle={name && name?.toUpperCase()}
                    clickFn={() => alert("Clicked Avatar!")}
                  />
                  {"  " + name}
                </div>
              ))
            ) : (
              <div style={{ padding: "8px 12px", fontSize: "14px" }}>
                No users found
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        textarea::placeholder {
          color: ${colors.placeholderColor};
        }
      `}</style>
    </div>
  );
}

function buttonStyle(colors) {
  return {
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
}
