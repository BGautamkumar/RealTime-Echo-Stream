import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Volume2, Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const SettingsNotificationsPage = () => {
  const navigate = useNavigate();
  const [notificationSettings, setNotificationSettings] = useState({
    messageNotifications: true,
    soundAlerts: true,
    emailNotifications: false,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveNotificationSettings = (key, value) => {
    const updatedSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    
    // Show appropriate feedback
    const settingName = key.replace(/([A-Z])/g, ' $1').trim();
    const status = value ? 'enabled' : 'disabled';
    toast.success(`${settingName} ${status}`);
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
          <h1 className="text-3xl font-bold text-base-content">Notifications</h1>
          <p className="text-base-content/70 mt-2">Manage your notification preferences</p>
        </div>

        <div className="space-y-6">
          {/* Message Notifications */}
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-base-content mb-6">Message Notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-base-content">Message Notifications</div>
                      <div className="text-sm text-base-content/70">Get notified when you receive new messages</div>
                    </div>
                  </div>
                  <button
                    onClick={() => saveNotificationSettings('messageNotifications', !notificationSettings.messageNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors transform hover:scale-105 ${
                      notificationSettings.messageNotifications ? 'bg-primary' : 'bg-base-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-base-100 transition-transform ${
                        notificationSettings.messageNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-base-content">Sound Alerts</div>
                      <div className="text-sm text-base-content/70">Play sound for new notifications</div>
                    </div>
                  </div>
                  <button
                    onClick={() => saveNotificationSettings('soundAlerts', !notificationSettings.soundAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors transform hover:scale-105 ${
                      notificationSettings.soundAlerts ? 'bg-primary' : 'bg-base-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-base-100 transition-transform ${
                        notificationSettings.soundAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-base-content">Email Notifications</div>
                      <div className="text-sm text-base-content/70">Receive email updates about your activity</div>
                    </div>
                  </div>
                  <button
                    onClick={() => saveNotificationSettings('emailNotifications', !notificationSettings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors transform hover:scale-105 ${
                      notificationSettings.emailNotifications ? 'bg-primary' : 'bg-base-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-base-100 transition-transform ${
                        notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-base-content mb-6">Advanced Settings</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-base-200/50">
                  <div className="text-sm text-base-content/70">
                    <strong>Tip:</strong> You can customize notification sounds and appearance in the advanced settings menu.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNotificationsPage;
