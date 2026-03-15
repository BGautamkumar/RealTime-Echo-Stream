import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Check, CheckCheck } from "lucide-react";
import { formatMessageTime } from "../lib/utils";

const MessageBubble = ({ message, isConsecutive }) => {
  const { authUser } = useAuthStore();
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const isOwn = message.senderId === authUser._id;
  const isEmojiOnly = message.text && /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(message.text.trim());

  const getStatusIcon = () => {
    if (!isOwn) return null;
    
    if (message.seen) {
      return <CheckCheck size={16} className="text-blue-500" />;
    } else if (message.delivered) {
      return <CheckCheck size={16} className="text-base-content/40" />;
    } else {
      return <Check size={16} className="text-base-content/40" />;
    }
  };

  const handleMessageClick = () => {
    if (message.image) {
      window.open(message.image, '_blank');
    }
  };

  return (
    <div className={`
      flex items-end gap-2 mb-1 animate-fadeIn
      ${isOwn ? "flex-row-reverse" : "flex-row"}
      ${isConsecutive ? "mt-1" : "mt-4"}
    `}>
        {/* Avatar (show for first message or when sender changes) */}
        {(!isConsecutive) && (
          <div className="flex-shrink-0 mb-1">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-base-300">
              <img
                src={isOwn ? (authUser?.profilePic || "/avatar.png") : (message.senderProfilePic || "/avatar.png")}
                alt="profile pic"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Spacer for consecutive messages */}
        {(!isConsecutive) && <div className="w-8" />}

        {/* Message content */}
        <div className={`
          max-w-xs lg:max-w-md xl:max-w-lg
          ${isOwn ? "items-end" : "items-start"}
          ${isConsecutive ? "" : "mb-1"}
          flex flex-col
        `}>
          {/* Sender name (only for group messages or non-consecutive) */}
          {!isOwn && !isConsecutive && (
            <div className="text-xs text-base-content/50 mb-1 px-1">
              {message.senderName}
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`
              relative group cursor-pointer transition-all duration-200
              ${isOwn 
                ? "bg-primary text-primary-content rounded-2xl rounded-br-sm hover:bg-primary/90" 
                : "bg-base-200 text-base-content rounded-2xl rounded-bl-sm hover:bg-base-300"
              }
              ${isEmojiOnly ? "text-2xl p-2" : "px-4 py-2"}
              ${message.image ? "p-1" : ""}
            `}
            onClick={handleMessageClick}
          >
            {/* Image */}
            {message.image && (
              <div className="relative">
                {isImageLoading && (
                  <div className="w-48 h-48 bg-base-300 rounded-lg animate-pulse flex items-center justify-center">
                    <div className="text-base-content/40">Loading...</div>
                  </div>
                )}
                <img
                  src={message.image}
                  alt="Attachment"
                  className={`
                    max-w-[200px] sm:max-w-[300px] rounded-lg
                    ${isImageLoading ? "hidden" : "block"}
                  `}
                  onLoad={() => setIsImageLoading(false)}
                />
              </div>
            )}

            {/* Text */}
            {message.text && (
              <p className={`
                break-words
                ${isEmojiOnly ? "text-center" : "text-sm leading-relaxed"}
                ${message.image ? "mt-2" : ""}
              `}>
                {message.text}
              </p>
            )}

            {/* Hover overlay for images */}
            {message.image && (
              <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-2">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Timestamp and status */}
          <div className={`
            flex items-center gap-1 mt-1 text-xs text-base-content/40
            ${isOwn ? "flex-row-reverse" : "flex-row"}
          `}>
            <span>{formatMessageTime(message.createdAt)}</span>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    );
  };

export default MessageBubble;
