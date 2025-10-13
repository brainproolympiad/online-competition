import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const StepNavigation = ({ activeTab, setActiveTab, steps, completedTabs, setCompletedTabs, canProceed, }) => {
    const handleNext = () => {
        if (!canProceed)
            return; // prevent navigation if validation fails
        setCompletedTabs((prev) => [...new Set([...prev, activeTab])]);
        if (activeTab < steps.length - 1)
            setActiveTab(activeTab + 1);
    };
    const handlePrev = () => {
        if (activeTab > 0)
            setActiveTab(activeTab - 1);
    };
    return (_jsxs("div", { className: "flex justify-between items-center mt-8 pt-4 border-t border-gray-200", children: [_jsxs("button", { onClick: handlePrev, disabled: activeTab === 0, className: `flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-300
          ${activeTab === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"}`, children: [_jsx(FaArrowLeft, { className: "text-sm" }), "Previous"] }), _jsxs("button", { onClick: handleNext, disabled: !canProceed || activeTab === steps.length - 1, className: `flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-300
          ${!canProceed || activeTab === steps.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"}`, children: ["Next", _jsx(FaArrowRight, { className: "text-sm" })] })] }));
};
export default StepNavigation;
