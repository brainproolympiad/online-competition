import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/components/ChartsSection.tsx
import React, { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from "../utils/adminUtils";
const ChartsSection = ({ participants }) => {
    const chartData = useMemo(() => {
        // Class Level Distribution
        const classDistribution = Object.entries(participants.reduce((acc, p) => {
            acc[p.classLevel] = (acc[p.classLevel] || 0) + 1;
            return acc;
        }, {})).map(([name, value]) => ({ name, value }));
        // Payment Status
        const paymentData = [
            { name: 'Paid', value: participants.filter(p => p.paid).length },
            { name: 'Unpaid', value: participants.filter(p => !p.paid).length }
        ];
        // Course Enrollment
        const courseEnrollment = Object.entries(participants.flatMap(p => p.courses).reduce((acc, course) => {
            acc[course] = (acc[course] || 0) + 1;
            return acc;
        }, {})).map(([course, count]) => ({ course, count })).slice(0, 10);
        // Monthly Registration
        const monthlyRegistrations = Object.entries(participants.reduce((acc, p) => {
            if (p.createdAt) {
                const month = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                acc[month] = (acc[month] || 0) + 1;
            }
            return acc;
        }, {})).map(([month, count]) => ({ month, count }));
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
                if (p.totalScore <= 20)
                    scoreRanges[0].count++;
                else if (p.totalScore <= 40)
                    scoreRanges[1].count++;
                else if (p.totalScore <= 60)
                    scoreRanges[2].count++;
                else if (p.totalScore <= 80)
                    scoreRanges[3].count++;
                else
                    scoreRanges[4].count++;
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
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "font-bold mb-4", children: "Class Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData.classDistribution, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "font-bold mb-4", children: "Payment Status" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: chartData.paymentData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: chartData.paymentData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "font-bold mb-4", children: "Top Courses" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData.courseEnrollment, layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number" }), _jsx(YAxis, { type: "category", dataKey: "course", width: 100 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#82ca9d" })] }) })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "font-bold mb-4", children: "Score Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData.scoreRanges, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "range" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#ff8042" })] }) })] })] }));
};
export default ChartsSection;
