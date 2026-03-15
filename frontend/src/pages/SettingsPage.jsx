import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  User,
  Shield,
  Bell,
  MessageSquare,
  Lock,
  Camera,
  ChevronRight,
  LogOut,
  Trash2,
} from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    toast.success("Logged out successfully");
  };

  const handleDeleteAccount = () => {
    console.log("Delete account action");
    setShowDeleteModal(false);
    toast.info("Account deletion feature coming soon");
  };

  const sections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Manage Profile",
          onClick: () => navigate("/profile"),
        },
        {
          icon: Camera,
          label: "Profile Picture",
          onClick: () => {},
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: Lock,
          label: "Password",
          onClick: () => navigate("/settings/privacy"),
        },
        {
          icon: Shield,
          label: "Privacy Settings",
          onClick: () => navigate("/settings/privacy"),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Message Notifications",
          onClick: () => navigate("/settings/notifications"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: MessageSquare,
          label: "Help Center",
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-base-100 text-base-content">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-base-100 border border-base-200 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">
              {section.title}
            </h2>

            <div className="space-y-2">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-base-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-primary" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Appearance */}
        <div className="bg-base-100 border border-base-200 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Appearance
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`btn ${
                theme === "light" ? "btn-primary" : "btn-ghost"
              }`}
            >
              Light
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`btn ${
                theme === "dark" ? "btn-primary" : "btn-ghost"
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-base-100 border border-red-200 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-red-600">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <LogOut className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="font-medium text-red-600">Logout</div>
                  <div className="text-sm text-red-500">Sign out of your account</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="font-medium text-red-600">Delete Account</div>
                  <div className="text-sm text-red-500">Permanently delete your account</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
              <p className="text-base-content/70 mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-error flex-1"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Account</h3>
              <p className="text-base-content/70 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn btn-error flex-1"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
