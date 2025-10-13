import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
const StepIndicator = ({ steps, activeTab, completedTabs }) => {
    return (_jsx("div", { className: "flex justify-between items-center", children: steps.map((step, index) => (_jsx("div", { className: "flex-1 text-center", children: _jsx("div", { className: `px-4 py-2 rounded-full text-sm font-semibold ${index === activeTab
                    ? "bg-blue-600 text-white"
                    : completedTabs.includes(index)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"}`, children: step.label }) }, index))) }));
};
export default StepIndicator;
