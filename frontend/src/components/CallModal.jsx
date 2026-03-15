import { useChatStore } from "../store/useChatStore";
import { Phone, X, Video } from "lucide-react";

const CallModal = () => {
  const { incomingCall, acceptCall, rejectCall } = useChatStore();

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 modal-enter">
      <div className="bg-base-100 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Call Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Video className="w-10 h-10 text-primary" />
          </div>

          {/* Call Info */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              Incoming Call
            </h3>
            <p className="text-base-content/70">
              User {incomingCall.from} is calling you
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={rejectCall}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 btn"
            >
              <X size={20} />
              Decline
            </button>
            <button
              onClick={acceptCall}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 btn"
            >
              <Phone size={20} />
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
