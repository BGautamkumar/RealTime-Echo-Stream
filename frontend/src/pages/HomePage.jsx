import { useChatStore } from "../store/useChatStore";

import EnhancedSidebar from "../components/EnhancedSidebar";
import NoChatSelected from "../components/NoChatSelected";
import EnhancedChatContainer from "../components/EnhancedChatContainer";
import CallModal from "../components/CallModal";



const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden pt-16">
      <CallModal />
      <div className="flex h-full">
        {/* Enhanced Sidebar - Hidden on mobile when chat is selected */}
        <div className={`
          ${selectedUser ? 'hidden lg:flex' : 'flex'}
          flex-shrink-0
        `}>
          <EnhancedSidebar />
        </div>

        {/* Enhanced Chat Area */}
        <div className={`
          flex-1 flex flex-col
          ${selectedUser ? 'flex' : 'hidden lg:flex'}
        `}>
          {selectedUser ? <EnhancedChatContainer /> : <NoChatSelected />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

