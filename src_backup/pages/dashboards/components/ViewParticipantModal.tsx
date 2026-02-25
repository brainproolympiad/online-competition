// src/components/ViewParticipantModal.tsx
import React from "react";
import type { Participant } from "../types/adminTypes";

interface ViewParticipantModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewParticipantModal: React.FC<ViewParticipantModalProps> = ({
  participant,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !participant) return null;

  const totalScore =
    (participant.subject1Score || 0) +
    (participant.subject2Score || 0) +
    (participant.subject3Score || 0) +
    (participant.subject4Score || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Participant Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{participant.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{participant.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Class Level</label>
                <p className="text-gray-900">{participant.classLevel}</p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Courses</h3>
            <div className="flex flex-wrap gap-2">
              {participant.courses && participant.courses.length > 0 ? (
                participant.courses.map((course, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {course}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No courses assigned</p>
              )}
            </div>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Subject 1</div>
                <div className="text-2xl font-bold text-gray-900">
                  {participant.subject1Score ?? "—"}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Subject 2</div>
                <div className="text-2xl font-bold text-gray-900">
                  {participant.subject2Score ?? "—"}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Subject 3</div>
                <div className="text-2xl font-bold text-gray-900">
                  {participant.subject3Score ?? "—"}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Subject 4</div>
                <div className="text-2xl font-bold text-gray-900">
                  {participant.subject4Score ?? "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Total Score */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-sm text-gray-500 uppercase tracking-wide">Total Score</div>
            <div className={`text-4xl font-bold mt-2 ${
              totalScore >= 300 ? "text-green-600" : 
              totalScore >= 200 ? "text-yellow-600" : 
              "text-red-600"
            }`}>
              {totalScore}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewParticipantModal;