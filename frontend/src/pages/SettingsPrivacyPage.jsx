import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, EyeOff, Users, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPrivacyPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    readReceipts: true,
    profileVisibility: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('privacySettings');
    if (savedSettings) {
      setPrivacySettings(JSON.parse(savedSettings));
    }
  }, []);

  const savePrivacySettings = (key, value) => {
    const updatedSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(updatedSettings);
    localStorage.setItem('privacySettings', JSON.stringify(updatedSettings));
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} updated`);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    // Here you would normally call an API
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-base-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Settings
          </button>
          <h1 className="text-3xl font-bold text-base-content">Privacy & Security</h1>
          <p className="text-base-content/70 mt-2">Manage your privacy and security settings</p>
        </div>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-base-content mb-6 flex items-center gap-2">
                <Shield size={20} />
                Privacy Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-base-200/50">
                  <div>
                    <div className="font-medium text-base-content">Show Online Status</div>
                    <div className="text-sm text-base-content/70">Let others see when you're online</div>
                  </div>
                  <button
                    onClick={() => savePrivacySettings('showOnlineStatus', !privacySettings.showOnlineStatus)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacySettings.showOnlineStatus ? 'bg-primary' : 'bg-base-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-base-100 transition-transform ${
                        privacySettings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-base-200/50">
                  <div>
                    <div className="font-medium text-base-content">Read Receipts</div>
                    <div className="text-sm text-base-content/70">Show when others have read your messages</div>
                  </div>
                  <button
                    onClick={() => savePrivacySettings('readReceipts', !privacySettings.readReceipts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacySettings.readReceipts ? 'bg-primary' : 'bg-base-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-base-100 transition-transform ${
                        privacySettings.readReceipts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-base-200/50">
                  <div>
                    <div className="font-medium text-base-content">Profile Visibility</div>
                    <div className="text-sm text-base-content/70">Make your profile visible to everyone</div>
                  </div>
                  <button
                    onClick={() => savePrivacySettings('profileVisibility', !privacySettings.profileVisibility)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacySettings.profileVisibility ? 'bg-primary' : 'bg-base-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-base-100 transition-transform ${
                        privacySettings.profileVisibility ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-base-content mb-6 flex items-center gap-2">
                <Lock size={20} />
                Security
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 bg-base-200 rounded-xl border border-base-300 focus:border-primary focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-base-200 rounded-xl border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-base-200 rounded-xl border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="btn btn-primary w-full"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPrivacyPage;
