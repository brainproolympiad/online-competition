// src/components/ParticipantsTable.tsx
import React from "react";
import type { Participant, QuizAttempt } from "../types/adminTypes";

interface ParticipantsTableProps {
  loading: boolean;
  filteredParticipants: Participant[];
  selectedParticipants: Set<string>;
  toggleParticipantSelection: (id: string) => void;
  toggleSelectAll: () => void;
  deleteParticipant?: (id: string) => void;
  openEditModal?: (participant: Participant) => void;
  openViewModal?: (participant: Participant) => void;
}

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  loading,
  filteredParticipants,
  selectedParticipants,
  toggleParticipantSelection,
  toggleSelectAll,
  deleteParticipant,
  openEditModal,
  openViewModal,
}) => {
  // Safe handler functions
  const handleView = (participant: Participant) => {
    openViewModal?.(participant);
  };

  const handleEdit = (participant: Participant) => {
    openEditModal?.(participant);
  };

  const handleDelete = (id: string) => {
    if (deleteParticipant) {
      deleteParticipant(id);
    }
  };

  // Calculate total score from quiz attempts
  const calculateTotalScore = (participant: Participant): number => {
    if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
      return 0;
    }
    
    return participant.quizAttempts.reduce((total, attempt) => {
      return total + (attempt.score || 0);
    }, 0);
  };

  // Calculate average score percentage
  const calculateAverageScore = (participant: Participant): number => {
    if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
      return 0;
    }
    
    const totalScore = calculateTotalScore(participant);
    const totalPossible = participant.quizAttempts.reduce((total, attempt) => {
      return total + (attempt.total_questions || 0);
    }, 0);
    
    return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  };

  // Get score color based on average percentage
  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // Get performance badge color
  const getPerformanceBadgeColor = (percentage: number): string => {
    if (percentage >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Get performance text
  const getPerformanceText = (percentage: number): string => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Help";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading participants...</span>
      </div>
    );
  }

  if (filteredParticipants.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="text-gray-400 text-4xl mb-3">📊</div>
        <div className="text-gray-500 text-lg font-medium">No participants found</div>
        <div className="text-gray-400 text-sm">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header with Stats */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-sm text-gray-600">Total Participants:</span>
              <span className="ml-2 text-lg font-semibold text-gray-900">{filteredParticipants.length}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Selected:</span>
              <span className="ml-2 text-lg font-semibold text-blue-600">{selectedParticipants.size}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">Total Attempts:</span>
            <span className="ml-2 text-lg font-semibold text-green-600">
              {filteredParticipants.reduce((acc, p) => acc + (p.quizAttempts?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedParticipants.size === filteredParticipants.length && filteredParticipants.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide">
                Participant
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide">
                Class & Courses
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide">
                Quiz Attempts
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide">
                Total Score
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide">
                Average
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide">
                Performance
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredParticipants.map((participant) => {
              const quizAttempts = participant.quizAttempts || [];
              const totalScore = calculateTotalScore(participant);
              const averageScore = calculateAverageScore(participant);
              const scoreColor = getScoreColor(averageScore);
              const performanceBadgeColor = getPerformanceBadgeColor(averageScore);
              const performanceText = getPerformanceText(averageScore);

              return (
                <tr key={participant.id} className="hover:bg-blue-50/30 transition-colors duration-150">
                  {/* Checkbox */}
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.has(participant.id)}
                      onChange={() => toggleParticipantSelection(participant.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  {/* Participant Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {participant.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{participant.fullName}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Class & Courses */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {participant.classLevel}
                      </span>
                      <div className="text-xs text-gray-600 max-w-xs">
                        {participant.courses?.slice(0, 2).join(", ")}
                        {participant.courses && participant.courses.length > 2 && (
                          <span className="text-blue-600 ml-1">+{participant.courses.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Quiz Attempts */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{quizAttempts.length}</span>
                        <span className="text-sm text-gray-500">attempts</span>
                      </div>
                      {quizAttempts.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Latest: {new Date(quizAttempts[0].submitted_at).toLocaleDateString()}
                        </div>
                      )}
                      {quizAttempts.some(attempt => attempt.cheat_attempts > 0) && (
                        <div className="text-xs text-red-600 font-medium flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                          Cheat detected
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Total Score */}
                  <td className="px-6 py-4">
                    <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">{totalScore}</div>
                      <div className="text-xs text-gray-500 mt-1">points</div>
                    </div>
                  </td>

                  {/* Average Score */}
                  <td className="px-6 py-4">
                    <div className={`text-center p-3 rounded-lg border ${scoreColor} border-current`}>
                      <div className="text-2xl font-bold">{averageScore}%</div>
                      <div className="text-xs opacity-75 mt-1">average</div>
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${performanceBadgeColor} border`}>
                        {performanceText}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(averageScore, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(participant)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors"
                      >
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleEdit(participant)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                      >
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(participant.id)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                      >
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing <span className="font-semibold">{filteredParticipants.length}</span> participants
          </div>
          <div>
            <span className="font-semibold text-blue-600">{selectedParticipants.size}</span> selected
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTable;