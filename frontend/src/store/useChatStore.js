import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  
  // Enhanced state
  searchQuery: "",
  activeTab: "all",
  showStatusModal: false,
  selectedStatus: null,
  showChatSearch: false,
  chatSearchQuery: "",
  typingUsers: new Set(),
  onlineUsers: new Set(),
  statuses: [],
  incomingCall: null,
  
  // Voice recording state
  isRecording: false,
  recordingDuration: 0,
  audioBlob: null,

  // Existing methods
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { socket } = useAuthStore.getState();
    
    try {
      const messagePayload = {
        chatId: `${selectedUser._id}_${useAuthStore.getState().authUser._id}`,
        senderId: useAuthStore.getState().authUser._id,
        receiverId: selectedUser._id,
        content: messageData.text || "",
        type: messageData.image ? "image" : "text",
        createdAt: Date.now()
      };

      // Emit via socket
      socket.emit("message:send", messagePayload);
      
      // Optimistically add to local state
      const newMessage = {
        _id: Date.now().toString(),
        ...messagePayload,
        seen: false,
        delivered: true
      };
      
      set({ messages: [...messages, newMessage] });
      
    } catch (error) {
      toast.error("Failed to send message");
    }
  },

  // ==================== TYPING INDICATORS ===================
  startTyping: () => {
    const { selectedUser } = get();
    const { socket, authUser } = useAuthStore.getState();
    if (selectedUser && socket) {
      socket.emit("typing:start", {
        chatId: `${selectedUser._id}_${authUser._id}`,
        userId: authUser._id
      });
    }
  },

  stopTyping: () => {
    const { selectedUser } = get();
    const { socket, authUser } = useAuthStore.getState();
    if (selectedUser && socket) {
      socket.emit("typing:stop", {
        chatId: `${selectedUser._id}_${authUser._id}`,
        userId: authUser._id
      });
    }
  },

  // ==================== STATUS MANAGEMENT ===================
  uploadStatus: (statusData) => {
    const { socket, authUser } = useAuthStore.getState();
    if (socket && authUser) {
      socket.emit("status:upload", {
        userId: authUser._id,
        ...statusData,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      });
      toast.success("Status uploaded");
    }
  },

  // ==================== VOICE MESSAGING ===================
  startRecording: () => {
    set({ isRecording: true, recordingDuration: 0 });
  },

  stopRecording: () => {
    set({ isRecording: false, recordingDuration: 0 });
  },

  sendVoiceMessage: async (audioBlob, duration) => {
    const { selectedUser } = get();
    const { socket, authUser } = useAuthStore.getState();
    
    if (!selectedUser || !socket || !audioBlob) return;

    try {
      // Convert blob to base64 (simplified)
      const reader = new FileReader();
      reader.onloadend = () => {
        const audioUrl = reader.result;
        
        socket.emit("voice:send", {
          chatId: `${selectedUser._id}_${authUser._id}`,
          senderId: authUser._id,
          receiverId: selectedUser._id,
          audioUrl,
          duration,
          createdAt: Date.now()
        });
      };
      reader.readAsDataURL(audioBlob);
      
      toast.success("Voice message sent");
    } catch (error) {
      toast.error("Failed to send voice message");
    }
  },

  // ==================== CALL MANAGEMENT ===================
  startCall: (userId) => {
    const { socket, authUser } = useAuthStore.getState();
    if (socket && authUser) {
      socket.emit("call:start", {
        from: authUser._id,
        to: userId,
        chatId: `${userId}_${authUser._id}`
      });
    }
  },

  acceptCall: () => {
    const { socket, incomingCall } = get();
    if (socket && incomingCall) {
      socket.emit("call:accept", {
        from: incomingCall.from,
        chatId: incomingCall.chatId
      });
      set({ incomingCall: null });
      toast.info("Call accepted");
    }
  },

  rejectCall: () => {
    const { socket, incomingCall } = get();
    if (socket && incomingCall) {
      socket.emit("call:reject", {
        from: incomingCall.from,
        chatId: incomingCall.chatId
      });
      set({ incomingCall: null });
      toast.info("Call rejected");
    }
  },

  // ==================== SOCKET EVENT HANDLERS ===================
  subscribeToMessages: () => {
    const { selectedUser } = get();
    const { socket, authUser } = useAuthStore.getState();
    if (!selectedUser || !socket) return;

    // Handle new messages
    socket.on("message:new", (message) => {
      const { messages, selectedUser } = get();
      if (message.receiverId === authUser._id || message.senderId === selectedUser._id) {
        set({ messages: [...messages, message] });
      }
    });

    // Handle typing indicators
    socket.on("typing:update", (data) => {
      const { typingUsers } = get();
      const newTypingUsers = new Set(typingUsers);
      
      if (data.isTyping) {
        newTypingUsers.add(data.userId);
      } else {
        newTypingUsers.delete(data.userId);
      }
      
      set({ typingUsers: newTypingUsers });
    });

    // Handle user status updates
    socket.on("user:status", (data) => {
      const { onlineUsers } = get();
      const newOnlineUsers = new Set(onlineUsers);
      
      if (data.status === "online") {
        newOnlineUsers.add(data.userId);
      } else {
        newOnlineUsers.delete(data.userId);
      }
      
      set({ onlineUsers: newOnlineUsers });
    });

    // Handle online users list
    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: new Set(users) });
    });

    // Handle status updates
    socket.on("status:list", (statuses) => {
      set({ statuses });
    });

    // Handle incoming calls
    socket.on("call:incoming", (data) => {
      set({ incomingCall: data });
      toast.info(`Incoming call from user ${data.from}`);
    });

    // Handle call responses
    socket.on("call:accepted", () => {
      toast.success("Call accepted");
    });

    socket.on("call:rejected", () => {
      toast.info("Call rejected");
    });

    // Handle errors
    socket.on("error", (error) => {
      toast.error(error.message || "Socket error occurred");
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    if (socket) {
      socket.off("message:new");
      socket.off("typing:update");
      socket.off("user:status");
      socket.off("getOnlineUsers");
      socket.off("status:list");
      socket.off("call:incoming");
      socket.off("call:accepted");
      socket.off("call:rejected");
      socket.off("error");
    }
  },

  // ==================== UI STATE MANAGEMENT ===================
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setShowStatusModal: (showStatusModal) => set({ showStatusModal }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setShowChatSearch: (showChatSearch) => set({ showChatSearch }),
  setChatSearchQuery: (chatSearchQuery) => set({ chatSearchQuery }),
  
  // ==================== FILTERING ===================
  getFilteredConversations: () => {
    const { users, activeTab, searchQuery } = get();
    
    let filtered = users;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    switch (activeTab) {
      case "pinned":
        return filtered.slice(0, 2);
      case "groups":
        return [];
      case "archived":
        return [];
      default:
        return filtered;
    }
  },
}));
