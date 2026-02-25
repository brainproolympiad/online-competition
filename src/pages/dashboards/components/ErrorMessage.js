import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ErrorMessage.tsx
import React from 'react';
const ErrorMessage = ({ error, navigate }) => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Quiz Not Available" }), _jsx("p", { className: "text-gray-600 mb-6", children: error || "The quiz you're looking for doesn't exist." }), _jsx("button", { onClick: () => navigate("/dashboard"), className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors", children: "Return to Dashboard" })] }) }));
};
export default ErrorMessage;
