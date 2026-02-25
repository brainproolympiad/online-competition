import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/EditParticipantModal.tsx
import React, { useState, useEffect } from "react";
const EditParticipantModal = ({ participant, isOpen, onClose, onSave, }) => {
    const [formData, setFormData] = useState(null);
    useEffect(() => {
        if (participant) {
            setFormData({
                ...participant,
                // Ensure all required fields are present
                courses: participant.courses || [],
                amountPaid: participant.amountPaid || 0,
                paid: participant.paid || false
            });
        }
    }, [participant]);
    if (!isOpen || !formData)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };
    const handleChange = (field, value) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };
    const handleCourseChange = (index, value) => {
        const newCourses = [...(formData.courses || [])];
        if (index >= newCourses.length) {
            newCourses.push(value);
        }
        else {
            newCourses[index] = value;
        }
        handleChange('courses', newCourses);
    };
    const addCourse = () => {
        const newCourses = [...(formData.courses || []), ''];
        handleChange('courses', newCourses);
    };
    const removeCourse = (index) => {
        const newCourses = formData.courses?.filter((_, i) => i !== index) || [];
        handleChange('courses', newCourses);
    };
    const handleScoreChange = (subjectNum, value) => {
        const scoreValue = value === '' ? undefined : parseInt(value);
        // Update both individual scores and the scores object
        setFormData(prev => {
            if (!prev)
                return null;
            const updated = { ...prev };
            // Update individual score
            updated[`subject${subjectNum}Score`] = scoreValue;
            // Update scores object
            updated.scores = {
                ...updated.scores,
                [`subject${subjectNum}`]: scoreValue || 0
            };
            // Update total score
            updated.totalScore = ((updated.subject1Score || 0) +
                (updated.subject2Score || 0) +
                (updated.subject3Score || 0) +
                (updated.subject4Score || 0));
            return updated;
        });
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Edit Participant" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 text-2xl", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Personal Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name *" }), _jsx("input", { type: "text", required: true, value: formData.fullName, onChange: (e) => handleChange('fullName', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email *" }), _jsx("input", { type: "email", required: true, value: formData.email, onChange: (e) => handleChange('email', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Class Level" }), _jsx("input", { type: "text", value: formData.classLevel, onChange: (e) => handleChange('classLevel', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Payment Status" }), _jsxs("select", { value: formData.paid ? "paid" : "unpaid", onChange: (e) => handleChange('paid', e.target.value === "paid"), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "unpaid", children: "Unpaid" }), _jsx("option", { value: "paid", children: "Paid" })] })] }), formData.paid && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Amount Paid" }), _jsx("input", { type: "number", step: "0.01", value: formData.amountPaid || 0, onChange: (e) => handleChange('amountPaid', parseFloat(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }))] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Courses" }), _jsx("button", { type: "button", onClick: addCourse, className: "px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600", children: "Add Course" })] }), _jsxs("div", { className: "space-y-2", children: [formData.courses?.map((course, index) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: course, onChange: (e) => handleCourseChange(index, e.target.value), className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Course name" }), _jsx("button", { type: "button", onClick: () => removeCourse(index), className: "px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600", children: "Remove" })] }, index))), (!formData.courses || formData.courses.length === 0) && (_jsx("p", { className: "text-gray-500 text-sm", children: "No courses added" }))] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Scores" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((subjectNum) => (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Subject ", subjectNum] }), _jsx("input", { type: "number", min: "0", max: "100", value: formData[`subject${subjectNum}Score`] || '', onChange: (e) => handleScoreChange(subjectNum, e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }, subjectNum))) }), formData.totalScore !== undefined && (_jsxs("div", { className: "mt-4 p-3 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "text-sm text-gray-600", children: "Total Score:" }), _jsx("div", { className: "text-xl font-bold text-blue-600", children: formData.totalScore })] }))] })] }), _jsxs("div", { className: "flex justify-end space-x-3 p-6 border-t", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), _jsx("button", { type: "button", onClick: handleSubmit, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: "Save Changes" })] })] }) }));
};
export default EditParticipantModal;
