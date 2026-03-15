import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const isSignupPage =
    location.pathname === "/signup" ||
    location.pathname === "/login";

  return (
    <header
      className={`
        w-full fixed top-0 left-0 z-50
        transition-all duration-300
        ${
          isSignupPage
            ? "bg-transparent shadow-none border-none"
            : "bg-base-100 shadow-md border-b border-base-200"
        }
      `}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/berserk-logo.jpeg"
            alt="Logo"
            className="w-10 h-10"
          />
          <h1 className="text-lg font-bold">Chat</h1>
        </Link>

        {authUser && (
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-ghost btn-sm gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">
                Settings
              </span>
            </Link>

            <Link
              to="/profile"
              className="btn btn-ghost btn-sm gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                Profile
              </span>
            </Link>

            <button
              onClick={logout}
              className="btn btn-ghost btn-sm gap-2 hover:text-error"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
