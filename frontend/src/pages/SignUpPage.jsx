import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

import toast from "react-hot-toast";

const SignUpPage = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-start pl-24"
      style={{
        backgroundImage: "url('/guts-berserk.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "cover"
      }}
    >
      <div className="relative w-[320px] max-w-[85%] rounded-2xl px-5 py-4 bg-black/55 backdrop-blur-md shadow-xl border border-white/5">
        {/* Subtle Red Glow Edge */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600/10 via-transparent to-black/40 pointer-events-none"></div>
        
        {/* Logo */}
        <div className="text-center mb-6 relative z-10">
          <div className="flex flex-col items-center gap-2 group">
            <img 
              src="/assets/berserk-logo.jpeg" 
              alt="Berserk Logo"
              className="w-20 h-20 object-contain"
            />
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Create Account
            </h1>
            <p className="text-gray-300">
              Get started with your free account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-white/60" size={20} />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/10 text-white placeholder-white/60 border border-white/10 rounded-lg px-4 py-2 pl-12 focus:outline-none focus:ring-1 focus:ring-red-500/40 transition-all duration-200"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-white/60" size={20} />
              <input
                type="email"
                placeholder="John@email.com"
                className="w-full bg-white/10 text-white placeholder-white/60 border border-white/10 rounded-lg px-4 py-2 pl-12 focus:outline-none focus:ring-1 focus:ring-red-500/40 transition-all duration-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-white/60" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••"
                className="w-full bg-white/10 text-white placeholder-white/60 border border-white/10 rounded-lg px-4 py-2 pl-12 pr-10 focus:outline-none focus:ring-1 focus:ring-red-500/40 transition-all duration-200"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-white/60 hover:text-white transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 transition-all duration-200"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-gray-300 text-sm text-center relative z-10">
          Already have an account? 
          <span 
            onClick={handleSignInClick}
            className="text-red-500 hover:text-red-400 cursor-pointer transition"
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
