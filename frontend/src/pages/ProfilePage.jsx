import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Phone, Link as LinkIcon, Plus, X, Save, Check } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [originalImg, setOriginalImg] = useState(null);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [phone, setPhone] = useState("");
  const [links, setLinks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const originalData = {
      fullName: authUser?.fullName || "",
      phone: "",
      links: []
    };
    const currentData = { fullName, phone, links };
    setHasChanges(JSON.stringify(originalData) !== JSON.stringify(currentData));
  }, [fullName, phone, links, authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      if (!originalImg) {
        setOriginalImg(authUser?.profilePic || "/avatar.png");
      }
    };
  };

  const handleSavePhoto = async () => {
    if (selectedImg) {
      setIsSaving(true);
      try {
        await updateProfile({ profilePic: selectedImg });
        setOriginalImg(selectedImg);
        setSelectedImg(null);
        toast.success("Profile photo updated successfully");
      } catch (error) {
        toast.error("Failed to update profile photo");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDiscardChanges = () => {
    setSelectedImg(null);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ fullName });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now(), url: "" }]);
  };

  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const updateLink = (id, url) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, url } : link
    ));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-base-100">
      <div className={`max-w-4xl mx-auto transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-base-100 shadow-lg"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 bg-primary hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 shadow-lg"
                >
                  <Camera className="w-4 h-4 text-primary-content" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-base-content">{fullName || authUser?.fullName}</h1>
                <p className="text-base-content/70 mt-1">{authUser?.email}</p>
              </div>
            </div>
            {selectedImg && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSavePhoto}
                  disabled={isSaving}
                  className="btn btn-primary btn-sm"
                >
                  {isSaving ? <span className="loading loading-spinner loading-xs"></span> : <Save size={14} />}
                  Save Photo
                </button>
                <button
                  onClick={handleDiscardChanges}
                  disabled={isSaving}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-base-200 rounded-xl border border-base-300 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70">Email Address</label>
                <div className="w-full px-4 py-3 bg-base-200 rounded-xl border border-base-300 text-base-content">
                  {authUser?.email}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 bg-base-200 rounded-xl border border-base-300 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70">Links</label>
                <div className="space-y-2">
                  {links.map((link) => (
                    <div key={link.id} className="flex gap-2">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 px-4 py-3 bg-base-200 rounded-xl border border-base-300 focus:border-primary focus:outline-none transition-colors"
                      />
                      <button
                        onClick={() => removeLink(link.id)}
                        className="btn btn-ghost btn-sm btn-circle"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addLink}
                    className="w-full px-4 py-3 bg-base-200 rounded-xl border border-base-300 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add link
                  </button>
                </div>
              </div>
            </div>

            {/* Save Changes Button */}
            {hasChanges && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? <span className="loading loading-spinner loading-sm"></span> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="border-t border-base-200 p-8">
            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Account Status</span>
              <span className="text-green-500 font-medium flex items-center gap-2">
                <Check size={16} />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
