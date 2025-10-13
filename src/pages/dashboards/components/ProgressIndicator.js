import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ProgressIndicator.tsx
import React from 'react';
const ProgressIndicator = ({ currentQuestion, totalQuestions }) => {
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
    return (_jsxs("div", { className: "mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [Math.round(progressPercentage), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${progressPercentage}%` } }) })] }));
};
export default ProgressIndicator;
