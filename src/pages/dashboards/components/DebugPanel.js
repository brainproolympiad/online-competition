import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/components/DebugPanel.tsx
import React from "react";
import Swal from "sweetalert2";
const DebugPanel = ({ debugLog, setDebugLog, fetchParticipants }) => {
    const handleClearStorage = () => {
        Swal.fire({
            title: 'Clear All Storage?',
            text: 'This will clear all cached data and settings!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, clear everything!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                Swal.fire('Success', 'All local storage cleared!', 'success');
                fetchParticipants();
            }
        });
    };
    return (_jsxs("div", { className: "mb-6 bg-gray-900 text-white p-4 rounded shadow max-h-96 overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h3", { className: "font-bold", children: "Debug Log" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleClearStorage, className: "bg-red-600 text-white px-2 py-1 rounded text-xs", children: "Clear All Storage" }), _jsx("button", { onClick: () => setDebugLog([]), className: "bg-red-600 text-white px-2 py-1 rounded text-xs", children: "Clear Log" })] })] }), _jsx("div", { className: "text-xs font-mono", children: debugLog.map((log, index) => (_jsxs("div", { className: "border-b border-gray-700 py-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-yellow-400", children: log.timestamp.split('T')[1].split('.')[0] }), _jsx("span", { className: "text-blue-400", children: log.action }), _jsx("span", { className: "text-green-400", children: log.participantId ? `ID: ${log.participantId.substring(0, 8)}...` : '' })] }), log.error && _jsxs("div", { className: "text-red-400", children: ["Error: ", log.error] }), log.data && _jsxs("div", { className: "text-gray-300", children: ["Data: ", JSON.stringify(log.data)] })] }, index))) })] }));
};
export default DebugPanel;
