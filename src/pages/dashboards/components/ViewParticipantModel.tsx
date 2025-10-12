// src/components/ViewParticipantModal.tsx
import React from 'react';
import type { Participant } from '../types/adminTypes';

interface ViewParticipantModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewParticipantModal: React.FC<ViewParticipantModalProps> = ({
  participant,
  isOpen,
  onClose
}) => {
  if (!isOpen || !participant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Participant Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Personal Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{participant.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-sm text-gray-900">{participant.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{participant.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Gender</label>
              <p className="mt-1 text-sm text-gray-900">{participant.gender || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="mt-1 text-sm text-gray-900">{participant.dob || 'N/A'}</p>
            </div>
          </div>

          {/* Educational Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Educational Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600">Class Level</label>
              <p className="mt-1 text-sm text-gray-900">{participant.classLevel}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">School Name</label>
              <p className="mt-1 text-sm text-gray-900">{participant.schoolName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">School Type</label>
              <p className="mt-1 text-sm text-gray-900">{participant.schoolType || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Term</label>
              <p className="mt-1 text-sm text-gray-900">{participant.term || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Favorite Subject</label>
              <p className="mt-1 text-sm text-gray-900">{participant.favoriteSubject || 'N/A'}</p>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Location Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600">State</label>
              <p className="mt-1 text-sm text-gray-900">{participant.state || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">LGA</label>
              <p className="mt-1 text-sm text-gray-900">{participant.lga || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <p className="mt-1 text-sm text-gray-900">{participant.address || 'N/A'}</p>
            </div>
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Courses & Payment
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600">Courses</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {participant.courses.map((course, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Payment Status</label>
              <p className={`mt-1 text-sm font-medium ${
                participant.paid ? 'text-green-600' : 'text-red-600'
              }`}>
                {participant.paid ? 'Paid' : 'Unpaid'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Amount Paid</label>
              <p className="mt-1 text-sm text-gray-900">₦{participant.amountPaid || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Quiz Link</label>
              <p className="mt-1 text-sm text-gray-900 break-all">
                {participant.quizLink || 'No quiz link assigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Scores Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Quiz Scores
          </h3>
          
          {participant.quizAttempts && participant.quizAttempts.length > 0 ? (
            <div className="space-y-4">
              {/* Individual Quiz Attempts */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Individual Quiz Attempts</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quiz</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participant.quizAttempts.map((attempt) => (
                        <tr key={attempt.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {attempt.quizzes?.title || 'Unknown Quiz'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {attempt.quizzes?.subject || 'Unknown'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {attempt.score}/{attempt.total_questions}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {attempt.total_questions > 0 
                              ? Math.round((attempt.score / attempt.total_questions) * 100) 
                              : 0
                            }%
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {attempt.submitted_at 
                              ? new Date(attempt.submitted_at).toLocaleDateString()
                              : 'Not submitted'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{participant.quizAttempts.length}</div>
                  <div className="text-sm text-gray-600">Total Quizzes Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{participant.totalScore}</div>
                  <div className="text-sm text-gray-600">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{participant.averageScore}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </div>

              {/* Subject-wise Breakdown */}
              {Object.keys(participant.subjectScores || {}).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Subject-wise Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(participant.subjectScores).map(([subject, data]) => (
                      <div key={subject} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="font-medium text-gray-900">{subject}</div>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Score:</span>
                            <span className="font-medium">{data.score}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Percentage:</span>
                            <span className="font-medium">{data.percentage}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Attempts:</span>
                            <span className="font-medium">{data.attempts}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No quiz attempts recorded yet.
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewParticipantModal;