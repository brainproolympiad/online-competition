// src/pages/dashboards/components/QuizInstructions.tsx
import React from "react";

interface QuizInstructionsProps {
  quiz: any;
  user: any;
  questionsLoading: boolean;
  questions: any[];
  proctoringError: string | null;
  hasExistingAttempt: boolean;
  previousAttempts: any[];
  canRetakeQuiz: boolean;
  maxAttemptsReached: boolean;
  latestCompletedAttempt: any;
  isCheckingAttempts: boolean;
  onStartQuiz: () => void;
  onViewResults?: (attempt: any) => void;
}

const QuizInstructions: React.FC<QuizInstructionsProps> = ({
  quiz,
  user,
  questionsLoading,
  questions,
  proctoringError,
  hasExistingAttempt,
  previousAttempts,
  maxAttemptsReached,
  latestCompletedAttempt,
  isCheckingAttempts,
  onStartQuiz,
  onViewResults,
}) => {
  const shouldBlockQuiz = maxAttemptsReached || hasExistingAttempt;
  const relevantAttempt =
    latestCompletedAttempt || previousAttempts[0] || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="text-center py-8 px-6 bg-white border-b">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {quiz.title}
          </h1>
          <p className="text-gray-500">{quiz.description}</p>
        </div>

        <div className="p-8">
          {/* User Info */}
          {user && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600">Name</p>
                <p className="font-semibold text-gray-800">{user.fullName}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600">Class</p>
                <p className="font-semibold text-gray-800">{user.classLevel}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-600">Course</p>
                <p className="font-semibold text-gray-800">{quiz.title}</p>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r mb-6">
            <p className="text-sm text-yellow-800 leading-relaxed">
              <strong>🔒 Privacy First:</strong> Your camera will be used{" "}
              <strong>only during the quiz</strong> to ensure fairness and
              integrity. We do not record, store, or share any footage — your
              privacy remains <strong>fully protected</strong>.
            </p>
          </div>

          {/* Key Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              📘 Quiz Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Duration:</strong> {quiz.duration_minutes} minutes
              </p>
              <p>
                <strong>Questions:</strong> {quiz.total_questions}
              </p>
              <p>
                <strong>Passing Score:</strong> {quiz.passing_score}%
              </p>
              <p>
                <strong>Attempt:</strong> One per participant
              </p>
            </div>
          </div>

          {/* Security Reminder */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              🚫 <strong>Note:</strong> Right-click, switching tabs, or leaving
              fullscreen will affect your session. Stay focused!
            </p>
          </div>

          {/* Attempt Info */}
          {shouldBlockQuiz && relevantAttempt && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-center mb-6">
              <p className="text-red-700 font-semibold text-lg mb-2">
                You’ve already attempted this quiz.
              </p>
              <p className="text-sm text-red-600">
                <strong>Score:</strong> {relevantAttempt.score}% |{" "}
                <strong>Correct:</strong> {relevantAttempt.correct_answers}/{quiz.total_questions}
              </p>
              {onViewResults && (
                <button
                  onClick={() => onViewResults(relevantAttempt)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
                >
                  View Result
                </button>
              )}
            </div>
          )}

          {/* Start Button */}
          <div className="text-center">
            {shouldBlockQuiz ? (
              <button
                onClick={() => window.history.back()}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-10 rounded-lg shadow-md"
              >
                Back to Dashboard
              </button>
            ) : (
              <button
                onClick={onStartQuiz}
                disabled={
                  questionsLoading || questions.length === 0 || isCheckingAttempts
                }
                className={`px-10 py-4 text-lg font-semibold rounded-xl transition-all ${
                  questionsLoading || questions.length === 0 || isCheckingAttempts
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:scale-105"
                }`}
              >
                {isCheckingAttempts
                  ? "Checking..."
                  : questionsLoading
                  ? "Loading..."
                  : questions.length === 0
                  ? "No Questions Available"
                  : "Start Quiz"}
              </button>
            )}

            {proctoringError && (
              <p className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {proctoringError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructions;
