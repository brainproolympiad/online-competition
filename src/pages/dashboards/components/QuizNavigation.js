import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/components/QuizNavigation.tsx
import React from 'react';
const QuizNavigation = ({ currentQuestion, totalQuestions, onPrevious, onNext, onSubmit }) => {
    const handleSubmit = () => {
        // Show confirmation dialog before submitting
        if (window.confirm("Are you sure you want to submit the quiz? You cannot change your answers after submission.")) {
            onSubmit();
        }
    };
    return (_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-lg p-6 border border-gray-200", children: [_jsx("button", { onClick: onPrevious, disabled: currentQuestion === 0, className: `px-8 py-3 rounded-xl font-semibold transition-all w-full sm:w-auto ${currentQuestion === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-gray-600 hover:bg-gray-700 text-white shadow hover:shadow-md transform hover:scale-105"}`, children: "\u2190 Previous Question" }), currentQuestion === totalQuestions - 1 ? (_jsx("button", { onClick: handleSubmit, className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto transform hover:scale-105 text-lg", children: "\uD83C\uDFAF Submit Quiz" })) : (_jsx("button", { onClick: onNext, className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto transform hover:scale-105", children: "Next Question \u2192" }))] }));
};
export default QuizNavigation;
