import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ParticipantsTable.tsx
import React from "react";
const ParticipantsTable = ({ loading, filteredParticipants, selectedParticipants, toggleParticipantSelection, toggleSelectAll, deleteParticipant, openEditModal, openViewModal, }) => {
    // Safe handler functions
    const handleView = (participant) => {
        openViewModal?.(participant);
    };
    const handleEdit = (participant) => {
        openEditModal?.(participant);
    };
    const handleDelete = (id) => {
        if (deleteParticipant) {
            deleteParticipant(id);
        }
    };
    // Calculate total score from quiz attempts
    const calculateTotalScore = (participant) => {
        if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
            return 0;
        }
        return participant.quizAttempts.reduce((total, attempt) => {
            return total + (attempt.score || 0);
        }, 0);
    };
    // Calculate average score percentage
    const calculateAverageScore = (participant) => {
        if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
            return 0;
        }
        const totalScore = calculateTotalScore(participant);
        const totalPossible = participant.quizAttempts.reduce((total, attempt) => {
            return total + (attempt.total_questions || 0);
        }, 0);
        return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    };
    // Get score color based on average percentage
    const getScoreColor = (percentage) => {
        if (percentage >= 80)
            return "text-green-600 bg-green-50";
        if (percentage >= 60)
            return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    };
    // Get performance badge color
    const getPerformanceBadgeColor = (percentage) => {
        if (percentage >= 80)
            return "bg-green-100 text-green-800 border-green-200";
        if (percentage >= 60)
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        return "bg-red-100 text-red-800 border-red-200";
    };
    // Get performance text
    const getPerformanceText = (percentage) => {
        if (percentage >= 80)
            return "Excellent";
        if (percentage >= 60)
            return "Good";
        if (percentage >= 40)
            return "Average";
        return "Needs Help";
    };
    if (loading) {
        return (_jsxs("div", { className: "flex justify-center items-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("span", { className: "ml-3 text-gray-600", children: "Loading participants..." })] }));
    }
    if (filteredParticipants.length === 0) {
        return (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg border border-gray-200", children: [_jsx("div", { className: "text-gray-400 text-4xl mb-3", children: "\uD83D\uDCCA" }), _jsx("div", { className: "text-gray-500 text-lg font-medium", children: "No participants found" }), _jsx("div", { className: "text-gray-400 text-sm", children: "Try adjusting your search criteria" })] }));
    }
    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm text-gray-600", children: "Total Participants:" }), _jsx("span", { className: "ml-2 text-lg font-semibold text-gray-900", children: filteredParticipants.length })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-gray-600", children: "Selected:" }), _jsx("span", { className: "ml-2 text-lg font-semibold text-blue-600", children: selectedParticipants.size })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Total Attempts:" }), _jsx("span", { className: "ml-2 text-lg font-semibold text-green-600", children: filteredParticipants.reduce((acc, p) => acc + (p.quizAttempts?.length || 0), 0) })] })] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full", children: [_jsx("thead", { className: "bg-gray-50/80", children: _jsxs("tr", { children: [_jsx("th", { className: "w-12 px-6 py-4", children: _jsx("input", { type: "checkbox", checked: selectedParticipants.size === filteredParticipants.length && filteredParticipants.length > 0, onChange: toggleSelectAll, className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" }) }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", children: "Participant" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", children: "Class & Courses" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", children: "Quiz Attempts" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", children: "Total Score" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", children: "Average" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", children: "Performance" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredParticipants.map((participant) => {
                                const quizAttempts = participant.quizAttempts || [];
                                const totalScore = calculateTotalScore(participant);
                                const averageScore = calculateAverageScore(participant);
                                const scoreColor = getScoreColor(averageScore);
                                const performanceBadgeColor = getPerformanceBadgeColor(averageScore);
                                const performanceText = getPerformanceText(averageScore);
                                return (_jsxs("tr", { className: "hover:bg-blue-50/30 transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "checkbox", checked: selectedParticipants.has(participant.id), onChange: () => toggleParticipantSelection(participant.id), className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-semibold text-sm", children: participant.fullName.split(' ').map(n => n[0]).join('').toUpperCase() }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold text-gray-900", children: participant.fullName }), _jsx("div", { className: "text-sm text-gray-500", children: participant.email })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200", children: participant.classLevel }), _jsxs("div", { className: "text-xs text-gray-600 max-w-xs", children: [participant.courses?.slice(0, 2).join(", "), participant.courses && participant.courses.length > 2 && (_jsxs("span", { className: "text-blue-600 ml-1", children: ["+", participant.courses.length - 2, " more"] }))] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-lg font-bold text-gray-900", children: quizAttempts.length }), _jsx("span", { className: "text-sm text-gray-500", children: "attempts" })] }), quizAttempts.length > 0 && (_jsxs("div", { className: "text-xs text-gray-500", children: ["Latest: ", new Date(quizAttempts[0].submitted_at).toLocaleDateString()] })), quizAttempts.some(attempt => attempt.cheat_attempts > 0) && (_jsxs("div", { className: "text-xs text-red-600 font-medium flex items-center", children: [_jsx("span", { className: "w-2 h-2 bg-red-500 rounded-full mr-1" }), "Cheat detected"] }))] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "text-center p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: totalScore }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "points" })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: `text-center p-3 rounded-lg border ${scoreColor} border-current`, children: [_jsxs("div", { className: "text-2xl font-bold", children: [averageScore, "%"] }), _jsx("div", { className: "text-xs opacity-75 mt-1", children: "average" })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex flex-col items-start space-y-2", children: [_jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${performanceBadgeColor} border`, children: performanceText }), _jsx("div", { className: "w-20 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500", style: { width: `${Math.min(averageScore, 100)}%` } }) })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleView(participant), className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors", children: _jsx("span", { children: "View" }) }), _jsx("button", { onClick: () => handleEdit(participant), className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors", children: _jsx("span", { children: "Edit" }) }), _jsx("button", { onClick: () => handleDelete(participant.id), className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors", children: _jsx("span", { children: "Delete" }) })] }) })] }, participant.id));
                            }) })] }) }), _jsx("div", { className: "px-6 py-4 bg-gray-50 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [_jsxs("div", { children: ["Showing ", _jsx("span", { className: "font-semibold", children: filteredParticipants.length }), " participants"] }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-blue-600", children: selectedParticipants.size }), " selected"] })] }) })] }));
};
export default ParticipantsTable;
