import React from "react";

interface Step {
  label: string;
  component: React.FC<any>;
}

interface StepIndicatorProps {
  steps: Step[];
  activeTab: number;
  completedTabs: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, activeTab, completedTabs }) => {
  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 text-center">
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              index === activeTab
                ? "bg-blue-600 text-white"
                : completedTabs.includes(index)
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
