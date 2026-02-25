// src/pages/dashboards/components/ChartsSection.tsx
import React, { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { Participant } from "../types/adminTypes";
import { COLORS } from "../utils/adminUtils";

interface ChartsSectionProps {
  participants: Participant[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ participants }) => {
  const chartData = useMemo(() => {
    // Class Level Distribution
    const classDistribution = Object.entries(
      participants.reduce((acc, p) => {
        acc[p.classLevel] = (acc[p.classLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    // Payment Status
    const paymentData = [
      { name: 'Paid', value: participants.filter(p => p.paid).length },
      { name: 'Unpaid', value: participants.filter(p => !p.paid).length }
    ];

    // Course Enrollment
    const courseEnrollment = Object.entries(
      participants.flatMap(p => p.courses).reduce((acc, course) => {
        acc[course] = (acc[course] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([course, count]) => ({ course, count })).slice(0, 10);

    // Monthly Registration
    const monthlyRegistrations = Object.entries(
      participants.reduce((acc, p) => {
        if (p.createdAt) {
          const month = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    ).map(([month, count]) => ({ month, count }));

    // Score Distribution
    const scoreRanges = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 }
    ];

    participants.forEach(p => {
      if (p.totalScore !== undefined) {
        if (p.totalScore <= 20) scoreRanges[0].count++;
        else if (p.totalScore <= 40) scoreRanges[1].count++;
        else if (p.totalScore <= 60) scoreRanges[2].count++;
        else if (p.totalScore <= 80) scoreRanges[3].count++;
        else scoreRanges[4].count++;
      }
    });

    return {
      classDistribution,
      paymentData,
      courseEnrollment,
      monthlyRegistrations,
      scoreRanges
    };
  }, [participants]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Class Distribution */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">Class Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.classDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Status */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">Payment Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.paymentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.paymentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Course Enrollment */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">Top Courses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.courseEnrollment} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="course" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Distribution */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.scoreRanges}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;