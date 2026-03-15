import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Search, 
  Settings, 
  Users, 
  Plus, 
  Phone, 
  MoreVertical,
  Pin,
  Archive,
  Users2,
  MessageSquare,
  X
} from "lucide-react";

const EnhancedSidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    showStatusModal,
    setShowStatusModal,
    statuses,
    getFilteredConversations,
    uploadStatus
  } = useChatStore();
  const { authUser } = useAuthStore();
  const { onlineUsers } = useChatStore();
  
  // Dropdown states
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettingsDropdown(false);
      }
      setShowChatMenu(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowSettingsDropdown(false);
        setShowChatMenu(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const filteredUsers = getFilteredConversations();

  // Settings dropdown handlers
  const handleNewChat = () => {
    setShowSettingsDropdown(false);
    // Navigate to new chat or open modal
    console.log("New chat clicked");
  };

  const handleCreateGroup = () => {
    setShowSettingsDropdown(false);
    console.log("Create group clicked");
  };

  const handleArchivedChats = () => {
    setShowSettingsDropdown(false);
    setActiveTab("archived");
  };

  // Chat menu handlers
  const handlePinChat = (userId) => {
    setShowChatMenu(null);
    console.log("Pin chat:", userId);
  };

  const handleMuteChat = (userId) => {
    setShowChatMenu(null);
    console.log("Mute chat:", userId);
  };

  const handleArchiveChat = (userId) => {
    setShowChatMenu(null);
    console.log("Archive chat:", userId);
  };

  const handleStatusClick = (user) => {
    if (user._id === authUser._id) {
      // Open status upload modal
      setShowStatusModal(true);
    } else {
      // Open other user's status viewer
      const userStatus = statuses.find(s => s.userId === user._id);
      if (userStatus) {
        setSelectedStatus(userStatus);
      }
    }
  };

  const handleDeleteChat = (userId) => {
    setShowChatMenu(null);
    if (confirm("Are you sure you want to delete this chat?")) {
      console.log("Delete chat:", userId);
    }
  };

  const tabs = [
    { id: "all", label: "All", icon: Users },
    { id: "pinned", label: "Pinned", icon: Pin },
    { id: "groups", label: "Groups", icon: Users2 },
    { id: "archived", label: "Archived", icon: Archive },
  ];

  if (isUsersLoading) {
    return (
      <aside className="h-full w-20 lg:w-96 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="p-4 border-b border-base-300">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-base-200 rounded-lg"></div>
            <div className="h-10 bg-base-200 rounded-lg"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-96 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/berserk-logo.jpeg" 
              alt="Berserk Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-semibold hidden lg:block">Messages</span>
          </div>
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-2 hover:bg-base-200 rounded-lg transition-colors"
            >
              <Settings size={18} />
            </button>
            
            {/* Settings Dropdown */}
            {showSettingsDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50 min-w-[200px] modal-enter">
                <button
                  onClick={handleNewChat}
                  className="w-full text-left px-4 py-3 hover:bg-base-200 transition-colors flex items-center gap-3"
                >
                  <MessageSquare size={16} className="text-base-content/70" />
                  New Chat
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="w-full text-left px-4 py-3 hover:bg-base-200 transition-colors flex items-center gap-3"
                >
                  <Users size={16} className="text-base-content/70" />
                  Create Group
                </button>
                <button
                  onClick={handleArchivedChats}
                  className="w-full text-left px-4 py-3 hover:bg-base-200 transition-colors flex items-center gap-3"
                >
                  <Archive size={16} className="text-base-content/70" />
                  Archived Chats
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="input input-bordered w-full pl-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Status Section */}
      <div className="border-b border-base-300">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-base-content/70">Status</h3>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* My Status */}
            <button
              onClick={() => handleStatusClick(authUser)}
              className="flex-shrink-0 flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={authUser?.profilePic || "/avatar.png"}
                    alt="My Status"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-base-100">
                  <Plus size={14} className="text-primary-content" />
                </div>
              </div>
              <span className="text-xs text-base-content/70">My Status</span>
            </button>

            {/* Other Statuses */}
            {users.slice(0, 5).map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="flex-shrink-0 flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-base-300">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-base-content/70 truncate max-w-[60px]">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-base-300">
        <div className="flex p-2 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all
                  ${activeTab === tab.id 
                    ? "bg-primary text-primary-content" 
                    : "hover:bg-base-200 text-base-content/70"
                  }
                `}
              >
                <Icon size={16} />
                <span className="hidden lg:inline text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Users className="size-12 text-base-content/20 mb-3" />
            <p className="text-sm text-base-content/50">
              {searchQuery ? "No users found" : `No ${activeTab} conversations`}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-all duration-200
                  ${selectedUser?._id === user._id 
                    ? "bg-primary/10 border-l-4 border-primary" 
                    : "border-l-4 border-transparent"
                  }
                `}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {onlineUsers.has(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-base-100"></span>
                  )}
                </div>

                {/* User info */}
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-base-content truncate">{user.fullName}</div>
                  <div className="text-sm text-base-content/60 flex items-center gap-1">
                    {onlineUsers.has(user._id) ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Active now</span>
                      </>
                    ) : (
                      <span>Offline</span>
                    )}
                  </div>
                </div>

                {/* Time and actions */}
                <div className="hidden lg:flex flex-col items-end gap-1">
                  <span className="text-xs text-base-content/40">12:30 PM</span>
                  <div className="relative">
                    <div 
                      role="button"
                      tabIndex={0}
                      onClick={() => setShowChatMenu(showChatMenu === user._id ? null : user._id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowChatMenu(showChatMenu === user._id ? null : user._id);
                        }
                      }}
                      className="p-1 hover:bg-base-200 rounded transition-colors cursor-pointer"
                    >
                      <MoreVertical size={14} className="text-base-content/50" />
                    </div>
                    
                    {/* Chat Menu Dropdown */}
                    {showChatMenu === user._id && (
                      <div className="absolute bottom-full right-0 mb-1 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50 min-w-[150px] modal-enter">
                        <button
                          onClick={() => handlePinChat(user._id)}
                          className="w-full text-left px-4 py-2 hover:bg-base-200 transition-colors text-sm"
                        >
                          📌 Pin Chat
                        </button>
                        <button
                          onClick={() => handleMuteChat(user._id)}
                          className="w-full text-left px-4 py-2 hover:bg-base-200 transition-colors text-sm"
                        >
                          🔕 Mute Chat
                        </button>
                        <button
                          onClick={() => handleArchiveChat(user._id)}
                          className="w-full text-left px-4 py-2 hover:bg-base-200 transition-colors text-sm"
                        >
                          📦 Archive Chat
                        </button>
                        <div className="border-t border-base-200 my-1"></div>
                        <button
                          onClick={() => handleDeleteChat(user._id)}
                          className="w-full text-left px-4 py-2 hover:bg-base-200 transition-colors text-sm text-red-600"
                        >
                          🗑️ Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default EnhancedSidebar;
