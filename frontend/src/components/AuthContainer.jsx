import { useState } from "react";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

const AuthContainer = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSwitchToSignup = () => {
    setIsSignup(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignup(false);
  };

  return (
    <div className="auth-container relative overflow-hidden h-screen">
      <div className={`auth-slider ${isSignup ? "active" : ""} relative h-full`}>
        {/* Login Panel */}
        <div className="login-panel auth-panel absolute inset-0">
          <LoginPage onSwitchToSignup={handleSwitchToSignup} />
        </div>
        
        {/* Signup Panel */}
        <div className="signup-panel auth-panel absolute inset-0">
          <SignUpPage onSwitchToLogin={handleSwitchToLogin} />
        </div>
      </div>
      
      {/* Diagonal Overlay */}
      <div className="auth-overlay"></div>
    </div>
  );
};

export default AuthContainer;
