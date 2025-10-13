import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/components/CapturesSection.tsx
import React, { useState } from 'react';
import ImagePopup from './ImagePopup';
const CapturesSection = ({ participantId, participantName, quizAttempts }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // Get all photo data from quiz attempts for this participant
    const allCaptures = quizAttempts
        .filter(attempt => attempt.photo_data && attempt.photo_data.length > 0)
        .flatMap(attempt => attempt.photo_data.map((url, index) => ({
        url,
        attemptId: attempt.id,
        quizTitle: attempt.quizzes?.title || 'Unknown Quiz',
        timestamp: attempt.submitted_at || attempt.created_at,
        index
    })));
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsPopupOpen(true);
    };
    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedImage(null);
    };
    if (allCaptures.length === 0) {
        return (_jsx("div", { className: "text-center py-4 text-gray-500 text-sm", children: "No proctoring captures available" }));
    }
    return (_jsxs("div", { className: "mt-4", children: [_jsxs("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: ["Proctoring Captures (", allCaptures.length, ")"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: allCaptures.map((capture, index) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200", onClick: () => handleImageClick(capture.url), children: _jsx("img", { src: capture.url, alt: `Capture ${index + 1}`, className: "w-full h-20 object-cover", onError: (e) => {
                                    const target = e.target;
                                    target.src = 'https://via.placeholder.com/100x80?text=Error';
                                } }) }), _jsxs("div", { className: "mt-1 text-xs text-gray-600 truncate", children: ["Capture ", index + 1] }), _jsx("div", { className: "text-xs text-gray-400 truncate", children: new Date(capture.timestamp).toLocaleDateString() })] }, `${capture.attemptId}-${capture.index}`))) }), _jsx(ImagePopup, { imageUrl: selectedImage || '', isOpen: isPopupOpen, onClose: closePopup })] }));
};
export default CapturesSection;
