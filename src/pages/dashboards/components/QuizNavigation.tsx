// src/pages/dashboards/components/QuizNavigation.tsx
import React from 'react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const handleSubmit = () => {
    // Show confirmation dialog before submitting
    if (window.confirm("Are you sure you want to submit the quiz? You cannot change your answers after submission.")) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className={`px-8 py-3 rounded-xl font-semibold transition-all w-full sm:w-auto ${
          currentQuestion === 0
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-gray-600 hover:bg-gray-700 text-white shadow hover:shadow-md transform hover:scale-105"
        }`}
      >
        ← Previous Question
      </button>

      {currentQuestion === totalQuestions - 1 ? (
        <button 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto transform hover:scale-105 text-lg"
        >
          🎯 Submit Quiz
        </button>
      ) : (
        <button 
          onClick={onNext}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto transform hover:scale-105"
        >
          Next Question →
        </button>
      )}
    </div>
  );
};

export default QuizNavigation;