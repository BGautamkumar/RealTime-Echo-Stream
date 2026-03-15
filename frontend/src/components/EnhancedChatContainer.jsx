import { useEffect, useRef, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import EnhancedChatHeader from "./EnhancedChatHeader";
import EnhancedMessageInput from "./EnhancedMessageInput";
import MessageBubble from "./MessageBubble";
import { memo } from "react";

// Local utility function for WhatsApp-style date formatting
const getWhatsAppDateLabel = (messageDate) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (messageDateOnly.getTime() === todayOnly.getTime()) {
    return "Today";
  } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: messageDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
};

const EnhancedChatContainer = memo(() => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    chatSearchQuery,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [currentStickyDateKey, setCurrentStickyDateKey] = useState(null);
  const [currentStickyDateLabel, setCurrentStickyDateLabel] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle scroll to update sticky date
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const dateElements = e.target.querySelectorAll('[data-date-key]');
    
    let currentDateLabel = null;
    let currentDateKey = null;
    
    for (const element of dateElements) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 80) { // Account for header height
        currentDateLabel = element.querySelector('.bg-base-300')?.textContent;
        currentDateKey = element.dataset.dateKey;
      } else {
        break;
      }
    }
    
    if (currentDateKey !== currentStickyDateKey) {
      setCurrentStickyDateKey(currentDateKey);
      setCurrentStickyDateLabel(currentDateLabel);
    }
  };

  // Group messages by date and sender
  const groupMessages = () => {
    const groups = [];
    let lastDateKey = null;

    filteredMessages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt);
      const dateKey = messageDate.toDateString(); // Unique key for each day
      
      // Show date separator only when day changes
      if (dateKey !== lastDateKey) {
        const dateLabel = getWhatsAppDateLabel(messageDate);
        groups.push({ 
          type: 'date', 
          date: dateLabel,
          dateKey: dateKey
        });
        lastDateKey = dateKey;
      }

      // Determine if message is consecutive (within 5 minutes of previous message from same sender)
      const isConsecutive = index > 0 &&
        message.senderId === filteredMessages[index - 1].senderId &&
        (message.createdAt - filteredMessages[index - 1].createdAt) < 300000; // 5 minutes

      groups.push({
        type: 'message',
        message,
        isConsecutive,
      });
    });

    return groups;
  };

  const filteredMessages = chatSearchQuery
    ? messages.filter(msg => 
        msg.text?.toLowerCase().includes(chatSearchQuery.toLowerCase())
      )
    : messages;

  const messageGroups = groupMessages();

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="text-base-content/50">Loading messages...</p>
          </div>
        </div>
        <EnhancedMessageInput />
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-200">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-base-content">Welcome to Chat</h3>
          <p className="text-base-content/60 max-w-md">
            Select a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EnhancedChatHeader />

      {/* Messages area with solid background */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {/* Sticky Date Header */}
        {currentStickyDateLabel && (
          <div className="sticky top-0 z-10 bg-base-200/95 backdrop-blur-sm border-b border-base-300">
            <div className="flex items-center justify-center py-2">
              <div className="bg-base-300 text-xs text-base-content/60 px-3 py-1 rounded-full animate-fade-in">
                {currentStickyDateLabel}
              </div>
            </div>
          </div>
        )}
        
        <div className="px-4 py-4">
          {filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2 bg-base-100/80 backdrop-blur p-8 rounded-2xl">
                <div className="text-6xl opacity-20">💬</div>
                <p className="text-base-content/50 font-medium">No messages yet</p>
                <p className="text-sm text-base-content/30">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {messageGroups.map((group, index) => {
                if (group.type === 'date') {
                  return (
                    <div 
                      key={`date-${index}`} 
                      data-date-key={group.dateKey}
                      className="flex items-center justify-center my-4 animate-fade-in"
                    >
                      <div className="bg-base-300 text-xs text-base-content/60 px-3 py-1 rounded-full">
                        {group.date}
                      </div>
                    </div>
                  );
                }

                return (
                  <MessageBubble
                    key={group.message._id}
                    message={group.message}
                    isConsecutive={group.isConsecutive}
                  />
                );
              })}
              <div ref={messageEndRef} />
            </div>
          )}
        </div>
      </div>

      <EnhancedMessageInput />
    </div>
  );
});

export default EnhancedChatContainer;
