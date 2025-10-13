import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/components/QuizHeader.tsx
import React from 'react';
const QuizHeader = ({ quiz, user, timeLeft, currentQuestion, questions, warnings }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    return (_jsx("div", { className: "bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: quiz?.title }), _jsx("p", { className: "text-gray-600 mt-1", children: quiz?.description }), _jsxs("div", { className: "flex flex-wrap gap-4 mt-2", children: [_jsxs("span", { className: "text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full", children: ["Question ", currentQuestion + 1, " of ", questions.length] }), _jsxs("span", { className: "text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full", children: ["Student: ", user?.fullName] })] })] }), _jsxs("div", { className: "flex flex-col md:items-end gap-3", children: [_jsx("div", { className: `text-3xl font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`, children: formatTime(timeLeft) }), _jsxs("div", { className: `text-lg font-semibold ${warnings > 0 ? 'text-red-600' : 'text-green-600'}`, children: ["\u26A0\uFE0F Warnings: ", warnings, "/10"] }), warnings > 0 && (_jsx("div", { className: "text-xs text-red-600 bg-red-50 px-2 py-1 rounded", children: warnings >= 8 ? '⚠️ High violation risk!' : 'Be careful!' }))] })] }) }));
};
export default QuizHeader;
