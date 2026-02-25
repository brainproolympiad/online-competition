import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/components/AdminHeader.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { saveToLocalStorage, LOCAL_STORAGE_KEYS } from "../utils/adminUtils";
const AdminHeader = ({ adminSettings, setAdminSettings, showDebug, setShowDebug, fetchParticipants, addDebugLog }) => {
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
            }
            catch (error) {
                Swal.fire('Error', 'Failed to upload avatar', 'error');
                addDebugLog("AVATAR_UPLOAD_ERROR", undefined, undefined, error.message);
            }
            finally {
                setIsUploadingAvatar(false);
            }
        }
    };
    return (_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: adminSettings.avatarUrl || `https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=64`, alt: "Admin Avatar", className: "w-12 h-12 rounded-full border-2 border-white shadow" }), _jsx("button", { onClick: handleUploadAvatar, disabled: isUploadingAvatar, className: "absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full text-xs hover:bg-blue-500 transition", title: "Change avatar", children: isUploadingAvatar ? '⏳' : '📷' })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Admin Dashboard" }), _jsx("p", { className: "text-gray-600", children: "Welcome back, Administrator" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: fetchParticipants, className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition text-sm", children: "Refresh Data" }), _jsx("button", { onClick: () => setShowDebug(!showDebug), className: "bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition text-sm", children: showDebug ? 'Hide Debug' : 'Show Debug' })] })] }));
};
export default AdminHeader;
