import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/LoadingSpinner.tsx
import React from 'react';
const LoadingSpinner = ({ message = "Loading..." }) => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: message })] }) }));
};
export default LoadingSpinner;
