import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/components/ImagePopup.tsx
import React from 'react';
const ImagePopup = ({ imageUrl, isOpen, onClose }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg max-w-4xl max-h-full overflow-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-4 border-b", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Proctoring Capture" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl font-bold", children: "\u00D7" })] }), _jsx("div", { className: "p-4", children: _jsx("img", { src: imageUrl, alt: "Proctoring capture", className: "max-w-full max-h-96 object-contain mx-auto", onError: (e) => {
                            const target = e.target;
                            target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        } }) }), _jsx("div", { className: "p-4 border-t text-center", children: _jsx("button", { onClick: onClose, className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600", children: "Close" }) })] }) }));
};
export default ImagePopup;
