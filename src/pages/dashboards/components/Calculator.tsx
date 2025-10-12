// src/components/Calculator.tsx
import React, { useState } from "react";

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [showCalculator, setShowCalculator] = useState(false);

  const handleButtonClick = (value: string) => {
    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const calculateResult = () => {
    try {
      // eslint-disable-next-line no-eval
      setDisplay(eval(display).toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
  };

  if (!showCalculator) {
    return (
      <button
        onClick={() => setShowCalculator(true)}
        className="fixed bottom-14 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Open Calculator"
      >
        🧮
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Calculator</h3>
        <button
          onClick={() => setShowCalculator(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="bg-gray-100 p-3 rounded mb-3 text-right font-mono text-lg">
        {display}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
          <button
            key={btn}
            onClick={() => btn === '=' ? calculateResult() : handleButtonClick(btn)}
            className={`p-2 rounded font-semibold ${
              btn === '='
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {btn}
          </button>
        ))}
        <button
          onClick={clearDisplay}
          className="col-span-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 font-semibold"
        >
          C
        </button>
      </div>
    </div>
  );
};

export default Calculator;