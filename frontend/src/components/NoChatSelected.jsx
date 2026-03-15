import { Users } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-base-200">
      <div className="text-center space-y-6 max-w-md px-6">
        {/* Icon Display */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <img 
                src="/assets/berserk-logo.jpeg" 
                alt="Berserk Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-base-100 border-4 border-base-200 flex items-center justify-center">
              <Users className="w-6 h-6 text-base-content/60" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-base-content">Welcome to Chat</h1>
          <p className="text-base-content/60 leading-relaxed">
            Select a conversation from the sidebar to start messaging with your friends and colleagues.
          </p>
        </div>

        {/* Quick Tips */}
        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <h3 className="font-medium text-sm mb-2 text-base-content/80">Quick Tips:</h3>
          <ul className="text-xs text-base-content/60 space-y-1 text-left">
            <li>• Click on any contact to start chatting</li>
            <li>• Share images and files easily</li>
            <li>• See who's online with green indicators</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
