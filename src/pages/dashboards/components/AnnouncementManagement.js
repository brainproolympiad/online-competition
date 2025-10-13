import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/AnnouncementManagement.tsx
import React, { useState } from 'react';
const AnnouncementManagement = ({ announcements, createAnnouncement, deleteAnnouncement, loading }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        priority: 'medium'
    });
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createAnnouncement(formData);
            setShowCreateForm(false);
            setFormData({
                title: '',
                message: '',
                priority: 'medium'
            });
        }
        catch (error) {
            console.error('Error creating announcement:', error);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await deleteAnnouncement(id);
            }
            catch (error) {
                console.error('Error deleting announcement:', error);
            }
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default: return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };
    if (loading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading announcements..." });
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "p-6 border-b", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Announcement Management" }), _jsx("button", { onClick: () => setShowCreateForm(true), className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors", children: "+ Create Announcement" })] }) }), showCreateForm && (_jsxs("div", { className: "p-6 border-b bg-gray-50", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Create New Announcement" }), _jsxs("form", { onSubmit: handleCreate, className: "grid grid-cols-1 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title" }), _jsx("input", { type: "text", required: true, value: formData.title, onChange: (e) => setFormData(prev => ({ ...prev, title: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter announcement title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Message" }), _jsx("textarea", { required: true, value: formData.message, onChange: (e) => setFormData(prev => ({ ...prev, message: e.target.value })), rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter announcement message" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), _jsxs("select", { value: formData.priority, onChange: (e) => setFormData(prev => ({ ...prev, priority: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors", children: "Create Announcement" }), _jsx("button", { type: "button", onClick: () => setShowCreateForm(false), className: "bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" })] })] })] })), _jsx("div", { className: "p-6", children: announcements.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No announcements created yet. Create your first announcement to get started." })) : (_jsx("div", { className: "space-y-4", children: announcements.map((announcement) => (_jsxs("div", { className: `border-l-4 rounded-r-lg p-4 ${getPriorityColor(announcement.priority)}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsx("h3", { className: "font-semibold text-lg", children: announcement.title }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-xs px-2 py-1 rounded-full ${announcement.priority === 'high' ? 'bg-red-200' :
                                                    announcement.priority === 'medium' ? 'bg-yellow-200' :
                                                        'bg-blue-200'}`, children: announcement.priority.toUpperCase() }), _jsx("span", { className: "text-xs text-gray-500", children: new Date(announcement.created_at).toLocaleDateString() })] })] }), _jsx("p", { className: "text-gray-700 mb-3", children: announcement.message }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: () => handleDelete(announcement.id), className: "bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors", children: "Delete" }) })] }, announcement.id))) })) })] }));
};
export default AnnouncementManagement;
