import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const About = () => {
    /* ---------------- 3D Mouse Follower ---------------- */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 300 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
    const handleMouseMove = (event) => {
        const { clientX, clientY, currentTarget } = event;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };
    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };
    /* ---------------- Mission Data ---------------- */
    const missionSlides = [
        {
            title: "Excellence",
            color: "from-blue-600 to-indigo-500",
            description: "We uphold the highest standards in academic competition, fostering a culture of deep curiosity and innovation.",
            icon: (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })),
        },
        {
            title: "Integrity",
            color: "from-indigo-600 to-blue-500",
            description: "We promote fairness and honesty in all we do, ensuring transparency and trust in every challenge and result.",
            icon: (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6A11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" })),
        },
        {
            title: "Innovation",
            color: "from-sky-600 to-blue-400",
            description: "We encourage forward-thinking ideas that redefine academic excellence and inspire transformative leadership.",
            icon: (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" })),
        },
        {
            title: "Community",
            color: "from-cyan-600 to-blue-500",
            description: "We build bridges among young thinkers and educators across borders, nurturing collaboration and shared growth.",
            icon: (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72M6 18.719a6.062 6.062 0 01-.963-3.197m0 0A5.995 5.995 0 0112 12.75a5.995 5.995 0 015.058 2.772" })),
        },
    ];
    const [currentMission, setCurrentMission] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setCurrentMission((p) => (p + 1) % missionSlides.length);
        }, 5000);
        return () => clearInterval(id);
    }, [missionSlides.length]);
    /* ---------------- Testimonials ---------------- */
    const testimonials = [
        {
            id: "1",
            initials: "AE",
            name: "Alexandra Eze",
            role: "Gold Medalist",
            quote: "The BrainPro Olympiad challenged my perspective and reshaped how I approach real-world problems.",
            accent: "from-blue-600 to-indigo-500",
        },
        {
            id: "2",
            initials: "AD",
            name: "Dr. Adetunji Davis",
            role: "School Director",
            quote: "BrainPro's dedication to fairness and academic integrity has transformed how educators measure success.",
            accent: "from-indigo-600 to-blue-500",
        },
        {
            id: "3",
            initials: "MT",
            name: "Maria Thompson",
            role: "Scholarship Recipient",
            quote: "Winning a medal here opened doors to scholarships and mentorship that continue to shape my career.",
            accent: "from-sky-600 to-blue-400",
        },
    ];
    const [visibleCount, setVisibleCount] = useState(2);
    useEffect(() => {
        const resize = () => {
            const w = window.innerWidth;
            if (w < 768)
                setVisibleCount(1);
            else
                setVisibleCount(2);
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);
    const [startIndex, setStartIndex] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setStartIndex((s) => (s + visibleCount) % testimonials.length);
        }, 5000);
        return () => clearInterval(id);
    }, [visibleCount, testimonials.length]);
    const visibleTestimonials = testimonials.slice(startIndex, startIndex + visibleCount);
    /* ---------------- Intersection Observers ---------------- */
    const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white", onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, children: [_jsx(motion.div, { className: "pointer-events-none fixed inset-0 z-50 transition duration-300", style: { rotateX, rotateY } }), _jsx(Navbar, {}), _jsxs(motion.section, { ref: heroRef, initial: { opacity: 0, y: 60 }, animate: heroInView ? { opacity: 1, y: 0 } : {}, transition: { duration: 1 }, className: "relative py-32 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-center text-white overflow-hidden", children: [_jsxs("h1", { className: "text-6xl md:text-7xl font-extrabold mb-6", children: ["About ", _jsx("span", { className: "text-cyan-300", children: "BrainPro Olympiad" })] }), _jsx("p", { className: "max-w-3xl mx-auto text-blue-100 text-lg md:text-xl leading-relaxed font-light", children: "Inspiring the next generation of thinkers, innovators, and problem-solvers through world-class academic challenges." })] }), _jsx("section", { className: "py-24 bg-white", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h2", { className: "text-4xl font-extrabold text-gray-800 mb-4", children: ["Our Core ", _jsx("span", { className: "text-blue-600", children: "Values" })] }), missionSlides.map((slide, i) => (_jsx(motion.div, { className: `p-6 rounded-2xl border border-gray-100 shadow-md cursor-pointer transition-all duration-300 ${currentMission === i
                                        ? "bg-gradient-to-br from-blue-50 to-white scale-105 shadow-xl"
                                        : "hover:bg-blue-50/30"}`, onClick: () => setCurrentMission(i), children: _jsxs("div", { className: "flex items-start gap-5", children: [_jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${slide.color}`, children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: slide.icon }) }), _jsxs("div", { children: [_jsx("h3", { className: `text-xl font-bold bg-gradient-to-r ${slide.color} bg-clip-text text-transparent`, children: slide.title }), _jsx("p", { className: "text-gray-600 mt-1", children: slide.description })] })] }) }, i)))] }), _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.6 }, className: `rounded-3xl h-96 flex flex-col items-center justify-center text-white shadow-xl bg-gradient-to-br ${missionSlides[currentMission].color}`, children: [_jsx("svg", { className: "w-16 h-16 mb-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: missionSlides[currentMission].icon }), _jsx("h3", { className: "text-3xl font-bold mb-3", children: missionSlides[currentMission].title }), _jsx("p", { className: "max-w-md text-center px-4 font-light", children: missionSlides[currentMission].description })] }, currentMission) })] }) }), _jsxs("section", { className: "py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white", children: [_jsxs("div", { className: "max-w-6xl mx-auto px-6 text-center mb-16", children: [_jsx("h2", { className: "text-5xl font-extrabold mb-4", children: "What People Say" }), _jsx("p", { className: "text-blue-200 max-w-3xl mx-auto", children: "Real reflections from participants and educators inspired by BrainPro." })] }), _jsx("div", { className: "flex flex-wrap justify-center gap-8", children: visibleTestimonials.map((t) => (_jsxs(motion.div, { whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 300 }, className: "relative w-full sm:w-[400px] bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-md", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${t.accent} opacity-0 group-hover:opacity-30 rounded-3xl transition-all duration-500` }), _jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: `w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg bg-gradient-to-br ${t.accent} text-white mr-4`, children: t.initials }), _jsxs("div", { className: "text-left", children: [_jsx("h4", { className: "font-bold text-lg", children: t.name }), _jsx("p", { className: "text-blue-200 text-sm", children: t.role })] })] }), _jsxs("p", { className: "italic text-blue-100 text-left leading-relaxed", children: ["\u201C", t.quote, "\u201D"] })] }, t.id))) })] }), _jsx(Footer, {})] }));
};
export default About;
