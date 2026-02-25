// src/components/ResourceManagement.tsx
import React, { useState } from 'react';
import type { Resource } from '../types/adminTypes';

interface ResourceManagementProps {
  resources: Resource[];
  createResource: (resource: Omit<Resource, 'id' | 'created_at'>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  loading: boolean;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({
  resources,
  createResource,
  deleteResource,
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    type: 'document' as 'document' | 'video' | 'quiz' | 'assignment'
  });

  const handleCreate = async (e: React.FormEvent) => {
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
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬';
      case 'quiz': return '📝';
      case 'assignment': return '📋';
      default: return '📄';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Resource Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add Resource
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter resource title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter resource description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Link</label>
              <input
                type="url"
                required
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/resource"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="document">Document 📄</option>
                <option value="video">Video 🎬</option>
                <option value="quiz">Quiz 📝</option>
                <option value="assignment">Assignment 📋</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Resource
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources List */}
      <div className="p-6">
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No resources added yet. Add your first resource to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                  <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                  <div className="flex gap-2">
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceManagement;