// src/pages/dashboards/components/QuizResults.tsx
import React from "react";

interface QuizResultsProps {
  quizResult: any;
  quiz: any;
  user: any;
  navigate: (path: string) => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quizResult,
  quiz,
  user,
  navigate,
}) => {
  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isPassed = quizResult.passed;
  const emoji = isPassed ? "" : "";
  const headerColor = isPassed ? "text-green-700" : "text-red-700";
  const bgColor = isPassed ? "bg-green-50" : "bg-red-50";
  const borderColor = isPassed ? "border-green-200" : "border-red-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-10 px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-10 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Quiz Results
          </h1>
          <p className="text-lg text-gray-500">{quiz?.title}</p>
          <p className="text-sm text-gray-400 mt-2">
            Submitted on {new Date(quizResult.completed_at).toLocaleString()}
          </p>
        </div>

        {/* Main Result */}
        <div
          className={`${bgColor} ${borderColor} border rounded-2xl text-center p-10 transition-all duration-500`}
        >
          <div className="text-6xl mb-3">{emoji}</div>
          <h2 className={`text-2xl font-bold ${headerColor}`}>
            {isPassed
              ? "Congratulations! You Passed"
              : "Better Luck Next Time"}
          </h2>
          <p className="text-gray-500 mt-2">
            You have completed this quiz successfully.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {quizResult.score}/{quiz.total_questions}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Percentage</p>
              <p className="text-2xl font-bold text-purple-600">
                {quizResult.percentage.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Correct</p>
              <p className="text-2xl font-bold text-green-600">
                {quizResult.correct_answers}/{quizResult.total_questions}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Time Spent</p>
              <p className="text-lg font-bold text-orange-500">
                {formatTimeSpent(quiz.time_spent)}
              </p>
            </div>
          </div>

          <p className="text-gray-500 mt-4">
            Passing Score:{" "}
            <span className="font-semibold">{quiz.passing_score}%</span>
          </p>
        </div>

        {/* Warnings */}
        {quizResult.warnings > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-800">
              Proctoring Warnings: {quizResult.warnings}/10
            </h3>
            {quizResult.violations?.length > 0 && (
              <ul className="list-disc list-inside mt-3 text-sm text-yellow-700 space-y-1">
                {quizResult.violations.map((v: string, i: number) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* User Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-10">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Student</p>
            <p className="font-medium">{user?.fullName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Class</p>
            <p className="font-medium">{user?.classLevel}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Course</p>
            <p className="font-medium">{quiz.title}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Print
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs mt-8">
          <p>Result ID: {quizResult.quiz_id}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
