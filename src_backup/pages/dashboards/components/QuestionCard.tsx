// src/components/QuestionCard.tsx
import React from 'react';

interface QuestionCardProps {
  question: any;
  questionIndex: number;
  selectedAnswer: string;
  onAnswerSelect: (questionIndex: number, answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  selectedAnswer,
  onAnswerSelect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Question {questionIndex + 1}
        </h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {question.marks} mark{question.marks !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div 
        className="prose prose-lg max-w-none mb-8 p-4 bg-gray-50 rounded-lg border"
        dangerouslySetInnerHTML={{ __html: question.question_text }} 
      />

      <div className="space-y-3">
        {Object.entries(question.options).map(([key, value]) => (
          <label 
            key={key}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedAnswer === key
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`question-${questionIndex}`}
              value={key}
              checked={selectedAnswer === key}
              onChange={() => onAnswerSelect(questionIndex, key)}
              className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex-1">
              <strong className="mr-3 text-gray-700">{key.toUpperCase()}.</strong>
              <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: value as string }} />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;