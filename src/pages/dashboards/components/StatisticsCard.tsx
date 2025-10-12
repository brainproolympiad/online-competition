// src/pages/dashboards/components/StatisticsCards.tsx
import React from "react";
import type { Statistics } from "../types/adminTypes";

interface StatisticsCardsProps {
  statistics: Statistics;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-gray-600">Total Participants</h3>
        <p className="text-2xl font-bold">{statistics.total}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-gray-600">Paid Participants</h3>
        <p className="text-2xl font-bold text-green-600">{statistics.paid}</p>
        <p className="text-sm text-gray-500">{Math.round(statistics.paymentRate)}% payment rate</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-gray-600">With Quiz Links</h3>
        <p className="text-2xl font-bold text-blue-600">{statistics.withQuizLinks}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-gray-600">Average Score</h3>
        <p className="text-2xl font-bold text-purple-600">{statistics.averageTotalScore}</p>
      </div>
    </div>
  );
};

export default StatisticsCards;