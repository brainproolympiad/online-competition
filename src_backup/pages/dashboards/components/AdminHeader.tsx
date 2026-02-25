// src/pages/dashboards/components/AdminHeader.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import type { AdminSettings } from "../types/adminTypes";
import { saveToLocalStorage, LOCAL_STORAGE_KEYS } from "../utils/adminUtils";

interface AdminHeaderProps {
  adminSettings: AdminSettings;
  setAdminSettings: (settings: AdminSettings) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  fetchParticipants: () => void;
  addDebugLog: (action: string, participantId?: string, data?: any, error?: string) => void;
  onLogout: () => void; // Add this line
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminSettings,
  setAdminSettings,
  showDebug,
  setShowDebug,
  fetchParticipants,
  addDebugLog,
  onLogout // Add this line
}) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleUploadAvatar = async () => {
    const { value: file } = await Swal.fire({
      title: 'Upload Admin Avatar',
      input: 'file',
      inputAttributes: { accept: 'image/*', 'aria-label': 'Upload your avatar image' },
      showCancelButton: true
    });

    if (file) {
      setIsUploadingAvatar(true);
      try {
        const mockAvatarUrl = `https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128`;
        const newSettings = { ...adminSettings, avatarUrl: mockAvatarUrl };
        setAdminSettings(newSettings);
        saveToLocalStorage(LOCAL_STORAGE_KEYS.ADMIN_SETTINGS, newSettings);
        Swal.fire('Success', 'Avatar uploaded successfully!', 'success');
        addDebugLog("AVATAR_UPLOAD_SUCCESS");
      } catch (error: any) {
        Swal.fire('Error', 'Failed to upload avatar', 'error');
        addDebugLog("AVATAR_UPLOAD_ERROR", undefined, undefined, error.message);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={adminSettings.avatarUrl || `https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=64`}
            alt="Admin Avatar"
            className="w-12 h-12 rounded-full border-2 border-white shadow"
          />
          <button
            onClick={handleUploadAvatar}
            disabled={isUploadingAvatar}
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full text-xs hover:bg-blue-500 transition"
            title="Change avatar"
          >
            {isUploadingAvatar ? '⏳' : '📷'}
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Administrator</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={fetchParticipants}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition text-sm"
        >
          Refresh Data
        </button>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition text-sm"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;