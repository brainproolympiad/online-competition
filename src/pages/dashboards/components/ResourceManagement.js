import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ResourceManagement.tsx
import React, { useState } from 'react';
const ResourceManagement = ({ resources, createResource, deleteResource, loading }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        type: 'document'
    });
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createResource(formData);
            setShowCreateForm(false);
            setFormData({
                title: '',
                description: '',
                link: '',
                type: 'document'
            });
        }
        catch (error) {
            console.error('Error creating resource:', error);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteResource(id);
            }
            catch (error) {
                console.error('Error deleting resource:', error);
            }
        }
    };
    const getResourceIcon = (type) => {
        switch (type) {
            case 'video': return '🎬';
            case 'quiz': return '📝';
            case 'assignment': return '📋';
            default: return '📄';
        }
    };
    if (loading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading resources..." });
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "p-6 border-b", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Resource Management" }), _jsx("button", { onClick: () => setShowCreateForm(true), className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors", children: "+ Add Resource" })] }) }), showCreateForm && (_jsxs("div", { className: "p-6 border-b bg-gray-50", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Add New Resource" }), _jsxs("form", { onSubmit: handleCreate, className: "grid grid-cols-1 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title" }), _jsx("input", { type: "text", required: true, value: formData.title, onChange: (e) => setFormData(prev => ({ ...prev, title: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter resource title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData(prev => ({ ...prev, description: e.target.value })), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter resource description" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Resource Link" }), _jsx("input", { type: "url", required: true, value: formData.link, onChange: (e) => setFormData(prev => ({ ...prev, link: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "https://example.com/resource" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData(prev => ({ ...prev, type: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "document", children: "Document \uD83D\uDCC4" }), _jsx("option", { value: "video", children: "Video \uD83C\uDFAC" }), _jsx("option", { value: "quiz", children: "Quiz \uD83D\uDCDD" }), _jsx("option", { value: "assignment", children: "Assignment \uD83D\uDCCB" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors", children: "Add Resource" }), _jsx("button", { type: "button", onClick: () => setShowCreateForm(false), className: "bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" })] })] })] })), _jsx("div", { className: "p-6", children: resources.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No resources added yet. Add your first resource to get started." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: resources.map((resource) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("span", { className: "text-2xl", children: getResourceIcon(resource.type) }), _jsx("h3", { className: "font-semibold text-gray-800", children: resource.title })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3 line-clamp-2", children: resource.description }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500 capitalize", children: resource.type }), _jsxs("div", { className: "flex gap-2", children: [_jsx("a", { href: resource.link, target: "_blank", rel: "noopener noreferrer", className: "bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors", children: "View" }), _jsx("button", { onClick: () => handleDelete(resource.id), className: "bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors", children: "Delete" })] })] })] }, resource.id))) })) })] }));
};
export default ResourceManagement;
