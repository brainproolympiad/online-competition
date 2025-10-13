import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { supabase } from "../supabaseClient";
const Alumni = () => {
    const [winners, setWinners] = useState([]);
    const [finalists, setFinalists] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [years, setYears] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const { data: winnersData, error: winnersError } = await supabase
                .from("alumni_winners")
                .select("*")
                .order("year", { ascending: false });
            const { data: finalistsData, error: finalistsError } = await supabase
                .from("alumni_finalists")
                .select("*")
                .order("year", { ascending: false });
            if (winnersError)
                console.error("Winners fetch error:", winnersError);
            if (finalistsError)
                console.error("Finalists fetch error:", finalistsError);
            if (winnersData) {
                setWinners(winnersData);
                const uniqueYears = Array.from(new Set(winnersData.map((w) => w.year))).sort((a, b) => parseInt(b) - parseInt(a));
                setYears(uniqueYears);
                setSelectedYear(uniqueYears[0]);
            }
            if (finalistsData)
                setFinalists(finalistsData);
        };
        fetchData();
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-white via-blue-50 to-gray-100", children: [_jsx(Navbar, {}), _jsxs(motion.section, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 }, className: "text-center py-24 px-6 md:px-16 bg-gradient-to-r from-blue-50 to-indigo-50", children: [_jsx("h1", { className: "text-5xl md:text-6xl font-extralight text-gray-800 mb-4 tracking-tight", children: "Distinguished Alumni" }), _jsx("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed", children: "Celebrating champions and finalists who illuminated the BrainPro Olympiad \u2014 the trailblazers of tomorrow." })] }), _jsx("div", { className: "flex justify-center gap-4 mt-10 mb-10 flex-wrap", children: years.map((year) => (_jsx("button", { onClick: () => setSelectedYear(year), className: `px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${selectedYear === year
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"}`, children: year }, year))) }), _jsxs("section", { className: "max-w-7xl mx-auto px-6 md:px-12 mb-20", children: [_jsxs("h2", { className: "text-center text-2xl font-light text-gray-700 mb-12", children: ["Medal Winners \u2014 ", selectedYear] }), _jsx(motion.div, { layout: true, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10", children: _jsx(AnimatePresence, { children: winners
                                .filter((w) => w.year === selectedYear)
                                .map((winner, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: index * 0.1 }, whileHover: {
                                    y: -10,
                                    scale: 1.02,
                                    boxShadow: "0 15px 25px rgba(0,0,0,0.1), 0 0 20px rgba(59,130,246,0.15)",
                                }, className: "bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center", children: [_jsx("div", { className: `w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-5 ${winner.position.includes("1st")
                                            ? "bg-yellow-100"
                                            : winner.position.includes("2nd")
                                                ? "bg-gray-100"
                                                : "bg-amber-100"}`, children: winner.position }), _jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: winner.name }), _jsx("p", { className: "text-sm text-gray-600", children: winner.school }), _jsxs("p", { className: "text-xs text-blue-600 mt-1", children: [winner.state, " STATE"] })] }, winner.id))) }) })] }), _jsxs("section", { className: "max-w-7xl mx-auto px-6 md:px-12 mb-20", children: [_jsxs("h2", { className: "text-center text-2xl font-light text-gray-700 mb-10", children: ["Distinguished Finalists \u2014 ", selectedYear] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: finalists
                            .filter((f) => f.year === selectedYear)
                            .map((f, index) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, delay: index * 0.05 }, whileHover: {
                                scale: 1.05,
                                backgroundColor: "#f8fafc",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                            }, className: "bg-white rounded-xl border border-gray-100 p-6 text-center", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold", children: f.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("") }), _jsx("h4", { className: "text-gray-800 text-base font-medium", children: f.name }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: f.school }), _jsx("p", { className: "text-xs text-blue-600 mt-1", children: f.state })] }, f.id))) })] }), _jsx(Footer, {})] }));
};
export default Alumni;
