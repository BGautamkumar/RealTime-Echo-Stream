import { useState, useRef, useEffect, useMemo, memo } from "react";
import { useChatStore } from "../store/useChatStore";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic,
  X 
} from "lucide-react";
import toast from "react-hot-toast";
import { emojis } from "../utils/emojis.js";

const EnhancedMessageInput = memo(() => {
  const { 
    selectedUser, 
    sendMessage, 
    startTyping, 
    stopTyping,
    isRecording: isRecordingFromStore,
    startRecording,
    stopRecording,
    sendVoiceMessage
  } = useChatStore();
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emojisList = useMemo(() => emojis, []);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleTyping = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Handle typing indicator
    if (newText.trim()) {
      startTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 1000);
    } else {
      stopTyping();
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !attachment) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: attachment,
      });
      
      setText("");
      setAttachment(null);
      stopTyping();
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachment(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleRecording = () => {
    if (isRecordingFromStore) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="bg-base-100 border-t border-base-300 px-4 py-3">
      {/* Attachment Preview */}
      {attachment && (
        <div className="mb-3 p-2 bg-base-200 rounded-lg flex items-center gap-3">
          <img src={attachment} alt="Attachment" className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <p className="text-sm text-base-content/70">Image attached</p>
          </div>
          <button
            onClick={removeAttachment}
            className="p-1 hover:bg-base-300 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-base-200 rounded-lg transition-colors"
          title="Attach file"
        >
          <Paperclip size={20} className="text-base-content/70" />
        </button>

        {/* Emoji picker */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
            title="Add emoji"
          >
            <Smile size={20} className="text-base-content/70" />
          </button>

          {/* Emoji picker dropdown */}
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 bg-base-100 border border-base-300 rounded-lg shadow-xl p-3 w-80 max-h-60 overflow-y-auto z-50">
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-2 hover:bg-base-200 rounded transition-colors text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 bg-base-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            rows={1}
            style={{ maxHeight: '120px' }}
          />
        </div>

        {/* Voice record / Send button */}
        {text.trim() || attachment ? (
          <button
            onClick={handleSend}
            className="p-2 bg-primary hover:bg-primary/90 text-primary-content rounded-lg transition-colors"
            title="Send message"
          >
            <Send size={20} />
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecordingFromStore 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "hover:bg-base-200"
            }`}
            title="Record voice"
          >
            <Mic size={20} className={isRecordingFromStore ? "text-white" : "text-base-content/70"} />
          </button>
        )}
      </div>
    </div>
  );
});

export default EnhancedMessageInput;
