// src/components/EditParticipantModal.tsx
import React, { useState, useEffect } from "react";
import type { Participant } from "../types/adminTypes";

interface EditParticipantModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (participant: Participant) => void;
}

const EditParticipantModal: React.FC<EditParticipantModalProps> = ({
  participant,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Participant | null>(null);

  useEffect(() => {
    if (participant) {
      setFormData({
        ...participant,
        // Ensure all required fields are present
        courses: participant.courses || [],
        amountPaid: participant.amountPaid || 0,
        paid: participant.paid || false
      });
    }
  }, [participant]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Participant, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleCourseChange = (index: number, value: string) => {
    const newCourses = [...(formData.courses || [])];
    if (index >= newCourses.length) {
      newCourses.push(value);
    } else {
      newCourses[index] = value;
    }
    handleChange('courses', newCourses);
  };

  const addCourse = () => {
    const newCourses = [...(formData.courses || []), ''];
    handleChange('courses', newCourses);
  };

  const removeCourse = (index: number) => {
    const newCourses = formData.courses?.filter((_, i) => i !== index) || [];
    handleChange('courses', newCourses);
  };

  const handleScoreChange = (subjectNum: number, value: string) => {
    const scoreValue = value === '' ? undefined : parseInt(value);
    
    // Update both individual scores and the scores object
    setFormData(prev => {
      if (!prev) return null;
      
      const updated = { ...prev };
      
      // Update individual score
      updated[`subject${subjectNum}Score` as keyof Participant] = scoreValue;
      
      // Update scores object
      updated.scores = {
        ...updated.scores,
        [`subject${subjectNum}`]: scoreValue || 0
      };
      
      // Update total score
      updated.totalScore = (
        (updated.subject1Score || 0) +
        (updated.subject2Score || 0) +
        (updated.subject3Score || 0) +
        (updated.subject4Score || 0)
      );
      
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Participant
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Level
                </label>
                <input
                  type="text"
                  value={formData.classLevel}
                  onChange={(e) => handleChange('classLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.paid ? "paid" : "unpaid"}
                  onChange={(e) => handleChange('paid', e.target.value === "paid")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {formData.paid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amountPaid || 0}
                    onChange={(e) => handleChange('amountPaid', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Courses</h3>
              <button
                type="button"
                onClick={addCourse}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Add Course
              </button>
            </div>
            <div className="space-y-2">
              {formData.courses?.map((course, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => handleCourseChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Course name"
                  />
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {(!formData.courses || formData.courses.length === 0) && (
                <p className="text-gray-500 text-sm">No courses added</p>
              )}
            </div>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((subjectNum) => (
                <div key={subjectNum}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject {subjectNum}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData[`subject${subjectNum}Score` as keyof Participant] || ''}
                    onChange={(e) => handleScoreChange(subjectNum, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            {formData.totalScore !== undefined && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Score:</div>
                <div className="text-xl font-bold text-blue-600">{formData.totalScore}</div>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditParticipantModal;