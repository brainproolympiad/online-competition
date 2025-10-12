// src/pages/dashboards/components/QuizHeader.tsx
import React from 'react';

interface QuizHeaderProps {
  quiz: any;
  user: any;
  timeLeft: number;
  currentQuestion: number;
  questions: any[];
  warnings: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  quiz,
  user,
  timeLeft,
  currentQuestion,
  questions,
  warnings
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{quiz?.title}</h1>
          <p className="text-gray-600 mt-1">{quiz?.description}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Student: {user?.fullName}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end gap-3">
          <div className={`text-3xl font-bold ${
            timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className={`text-lg font-semibold ${
            warnings > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            ⚠️ Warnings: {warnings}/10
          </div>
          
          {warnings > 0 && (
            <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              {warnings >= 8 ? '⚠️ High violation risk!' : 'Be careful!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;