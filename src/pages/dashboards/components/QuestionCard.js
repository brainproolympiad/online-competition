import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// src/components/QuestionCard.tsx
import React from 'react';
const QuestionCard = ({ question, questionIndex, selectedAnswer, onAnswerSelect }) => {
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-900", children: ["Question ", questionIndex + 1] }), _jsxs("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: [question.marks, " mark", question.marks !== 1 ? 's' : ''] })] }), _jsx("div", { className: "prose prose-lg max-w-none mb-8 p-4 bg-gray-50 rounded-lg border", dangerouslySetInnerHTML: { __html: question.question_text } }), _jsx("div", { className: "space-y-3", children: Object.entries(question.options).map(([key, value]) => (_jsxs("label", { className: `flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedAnswer === key
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`, children: [_jsx("input", { type: "radio", name: `question-${questionIndex}`, value: key, checked: selectedAnswer === key, onChange: () => onAnswerSelect(questionIndex, key), className: "mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500" }), _jsxs("span", { className: "flex-1", children: [_jsxs("strong", { className: "mr-3 text-gray-700", children: [key.toUpperCase(), "."] }), _jsx("span", { className: "text-gray-800", dangerouslySetInnerHTML: { __html: value } })] })] }, key))) })] }));
};
export default QuestionCard;
