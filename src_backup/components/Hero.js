import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const navigate = useNavigate();
    const handleRegisterNavigation = () => navigate("/Register");
    const slides = [
        {
            id: 1,
            imageUrl: "https://africanolympiads.com/wp-content/uploads/2020/02/w2.png",
            title: "Excel in Your Exams",
            subtitle: "Practice Makes Perfect",
            description: "Our platform offers practice questions and smart analytics so you study smarter and score higher.",
        },
        {
            id: 2,
            imageUrl: "https://africanolympiads.com/wp-content/uploads/2020/02/w1.jpg",
            title: "Comprehensive Materials",
            subtitle: "All Subjects Covered",
            description: "Everything you need — from foundational lessons to exam-style practice questions.",
        },
        {
            id: 3,
            imageUrl: "https://dailypost.ng/wp-content/uploads/2015/03/jamb.jpg",
            title: "Track Your Progress",
            subtitle: "Measure Improvement",
            description: "Detailed analytics show strengths and help you focus on what matters most.",
        },
        {
            id: 4,
            imageUrl: "https://coronaschools.org/wp-content/uploads/2020/04/Corona-sec-school-students.jpg",
            title: "Join Study Groups",
            subtitle: "Collaborate with Peers",
            description: "Form study groups, share resources and learn together for better results.",
        },
    ];
    useEffect(() => {
        if (!isPlaying)
            return;
        const timer = setTimeout(() => goToNext(), 7000);
        return () => clearTimeout(timer);
    }, [currentSlide, isPlaying]);
    const goToNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            setIsTransitioning(false);
        }, 700);
    };
    const goToPrev = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
            setIsTransitioning(false);
        }, 700);
    };
    const goToSlide = (index) => {
        if (index === currentSlide)
            return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsTransitioning(false);
        }, 700);
    };
    const togglePlayPause = () => setIsPlaying((s) => !s);
    // vertical line heights (unique per slide) — adjust numbers for desired visual lengths
    const lineHeights = ["h-6", "h-8", "h-4", "h-10"];
    return (_jsxs("div", { className: "relative w-full h-screen overflow-hidden pt-16", children: [slides.map((slide, index) => (_jsxs("div", { className: `absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"}`, "aria-hidden": index !== currentSlide, children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-10000 ease-out", style: { backgroundImage: `url(${slide.imageUrl})`, transform: "scale(1.08)" } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" }), _jsx("div", { className: `absolute inset-0 flex items-center justify-center px-6 transition-all duration-900 ease-out ${isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"}`, children: _jsxs("div", { className: "text-center text-white max-w-4xl", children: [_jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-3 leading-tight", children: _jsx("span", { className: "bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent", children: slide.title }) }), _jsx("h3", { className: "text-lg md:text-xl lg:text-2xl font-medium mb-4 text-blue-200", children: _jsx("span", { className: "bg-blue-600/10 px-3 py-1 rounded-full", children: slide.subtitle }) }), _jsx("p", { className: "text-base md:text-lg mb-8 max-w-2xl mx-auto text-gray-200", children: slide.description })] }) })] }, slide.id))), _jsx("button", { onClick: goToPrev, className: "absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-xl transition-all duration-300 z-20", "aria-label": "Previous slide", children: _jsx(ChevronLeftIcon, { className: "h-6 w-6" }) }), _jsx("button", { onClick: goToNext, className: "absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-xl transition-all duration-300 z-20", "aria-label": "Next slide", children: _jsx(ChevronRightIcon, { className: "h-6 w-6" }) }), _jsxs("div", { className: "absolute bottom-28 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: handleRegisterNavigation, className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 px-8 rounded-full shadow-lg hover:scale-[1.03] transition-transform duration-300", children: "Get Started" }), _jsx("button", { onClick: togglePlayPause, "aria-pressed": isPlaying, className: "flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200", title: isPlaying ? "Pause autoplay" : "Play autoplay", children: isPlaying ? _jsx(PauseIcon, { className: "h-5 w-5" }) : _jsx(PlayIcon, { className: "h-5 w-5" }) })] }), _jsxs("p", { className: "text-xs text-white/70", children: ["Use arrows or numbers to navigate \u2022 Autoplay ", isPlaying ? "on" : "off"] })] }), _jsx("div", { className: "absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-end gap-8 z-30", children: slides.map((_, index) => {
                    const active = index === currentSlide;
                    return (_jsxs("button", { onClick: () => goToSlide(index), className: "flex flex-col items-center gap-2 group focus:outline-none", "aria-label": `Go to slide ${index + 1}`, children: [_jsx("span", { className: `text-sm font-semibold transition-colors duration-300 ${active ? "text-blue-400 scale-110" : "text-white/70 group-hover:text-white"}`, children: index + 1 }), _jsx("div", { className: `w-1 rounded-full transition-all duration-500 ${active ? "bg-blue-400" : "bg-white/40"} ${lineHeights[index]}`, style: {
                                    // subtle scale animation for active one
                                    transform: active ? "translateY(0) scaleY(1.05)" : "translateY(0) scaleY(1)",
                                } })] }, index));
                }) }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" }), _jsx("div", { className: "absolute top-24 left-10 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse" }), _jsx("div", { className: "absolute top-40 right-20 w-5 h-5 bg-purple-400 rounded-full opacity-30 animate-bounce" })] }));
};
export default Hero;
