import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Phone, 
  Search, 
  MoreVertical, 
  X,
  Video,
  ArrowLeft
} from "lucide-react";

const EnhancedChatHeader = () => {
  const { selectedUser, showChatSearch, setShowChatSearch, chatSearchQuery, setChatSearchQuery, startCall } = useChatStore();
  const { onlineUsers } = useChatStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  if (!selectedUser) return null;

  const isUserOnline = onlineUsers.has(selectedUser._id);

  const handleCall = () => {
    startCall(selectedUser._id);
  };

  const handleVideoCall = () => {
    startCall(selectedUser._id);
    toast.info("Video call feature coming soon");
  };

  const toggleChatSearch = () => {
    setShowChatSearch(!showChatSearch);
    if (showChatSearch) {
      setChatSearchQuery("");
    }
  };

  return (
    <div className="bg-base-100 border-b border-base-300 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - User info */}
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          <button className="lg:hidden p-2 hover:bg-base-200 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {isUserOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100"></span>
            )}
          </div>
          
          <div>
            <div className="font-semibold text-base-content">{selectedUser.fullName}</div>
            <div className="text-sm text-base-content/60 flex items-center gap-1">
              {isUserOnline ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Active now</span>
                </>
              ) : (
                <span>Offline</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Search bar (shown when active) */}
          {showChatSearch && (
            <div className={`flex items-center gap-2 transition-all duration-200 ${
              isSearchFocused ? "w-64" : "w-48"
            }`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="input input-bordered input-sm w-full pl-10"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  autoFocus
                />
              </div>
              <button
                onClick={toggleChatSearch}
                className="p-1 hover:bg-base-200 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={handleCall}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors group"
            title="Voice call"
          >
            <Phone size={20} className="text-base-content/70 group-hover:text-base-content" />
          </button>

          <button
            onClick={handleVideoCall}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors group"
            title="Video call"
          >
            <Video size={20} className="text-base-content/70 group-hover:text-base-content" />
          </button>

          <button
            onClick={toggleChatSearch}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors group"
            title="Search messages"
          >
            <Search size={20} className="text-base-content/70 group-hover:text-base-content" />
          </button>

          <button
            className="p-2 hover:bg-base-200 rounded-lg transition-colors group"
            title="More options"
          >
            <MoreVertical size={20} className="text-base-content/70 group-hover:text-base-content" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatHeader;
