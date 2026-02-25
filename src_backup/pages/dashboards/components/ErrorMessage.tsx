// src/components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  error: string | null;
  navigate: (path: string) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, navigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Quiz Not Available</h1>
        <p className="text-gray-600 mb-6">{error || "The quiz you're looking for doesn't exist."}</p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;