import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Step {
  label: string;
  component: React.FC<any>;
}

interface StepNavigationProps {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  steps: Step[];
  completedTabs: number[];
  setCompletedTabs: React.Dispatch<React.SetStateAction<number[]>>;
  canProceed: boolean; // ✅ new prop for validation control
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  activeTab,
  setActiveTab,
  steps,
  completedTabs,
  setCompletedTabs,
  canProceed,
}) => {
  const handleNext = () => {
    if (!canProceed) return; // prevent navigation if validation fails
    setCompletedTabs((prev) => [...new Set([...prev, activeTab])]);
    if (activeTab < steps.length - 1) setActiveTab(activeTab + 1);
  };

  const handlePrev = () => {
    if (activeTab > 0) setActiveTab(activeTab - 1);
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={activeTab === 0}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-300
          ${
            activeTab === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
          }`}
      >
        <FaArrowLeft className="text-sm" />
        Previous
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!canProceed || activeTab === steps.length - 1}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-300
          ${
            !canProceed || activeTab === steps.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          }`}
      >
        Next
        <FaArrowRight className="text-sm" />
      </button>
    </div>
  );
};

export default StepNavigation;
