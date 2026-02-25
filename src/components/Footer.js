import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGraduationCap, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, } from "react-icons/fa";
import { supabase } from "../supabaseClient";
const Footer = () => {
    const slides = [
        {
            title: "Stay Updated",
            text: "Subscribe to get the latest competition updates, tips, and resources.",
        },
        {
            title: "Join Our Academic Community",
            text: "Get exclusive access to study materials, past questions, and live events.",
        },
        {
            title: "Don’t Miss Out",
            text: "Be the first to know about new Olympiads, scholarship exams, and news.",
        },
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % slides.length);
                setFade(true);
            }, 600);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        if (!email) {
            setMessage("Please enter a valid email.");
            setLoading(false);
            return;
        }
        const { error } = await supabase.from("newsletter_subscribers").insert([{ email }]);
        if (error) {
            if (error.message.includes("duplicate")) {
                setMessage("This email is already subscribed");
            }
            else {
                setMessage("Failed to subscribe. Please try again.");
            }
        }
        else {
            setMessage("Successfully subscribed!");
            setEmail("");
        }
        setLoading(false);
    };
    return (_jsxs("footer", { className: "bg-gradient-to-b from-white via-blue-50 to-white text-gray-700 border-t border-blue-100 pt-16 pb-10 px-6 md:px-12 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400" }), _jsx("div", { className: "absolute -top-24 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl" }), _jsxs("div", { className: "max-w-7xl mx-auto relative z-10", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start gap-10 mb-14", children: [_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full shadow-lg", children: _jsx(FaGraduationCap, { className: "text-2xl text-white" }) }), _jsx("h2", { className: "text-3xl font-bold text-gray-800 tracking-tight", children: "Brain Pro Olympiad" })] }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: "Empowering students through innovation, excellence, and competition \u2014 shaping the next generation of leaders and innovators." }), _jsx("div", { className: "flex space-x-4 pt-3", children: [FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube].map((Icon, idx) => (_jsx("button", { className: "text-gray-500 hover:text-blue-600 transition-colors text-lg", children: _jsx(Icon, {}) }, idx))) })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-10 flex-1", children: [
                                    {
                                        title: "Explore",
                                        links: ["Home", "About Us", "Programs", "Alumni", "News & Updates"],
                                    },
                                    {
                                        title: "Programs",
                                        links: [
                                            "Science Olympiad",
                                            "Math Marathon",
                                            "Innovation Fair",
                                            "Essay Competition",
                                            "Scholarship Exams",
                                        ],
                                    },
                                    {
                                        title: "Resources",
                                        links: [
                                            "Past Questions",
                                            "Study Materials",
                                            "Practice Tests",
                                            "Research Corner",
                                            "FAQs",
                                        ],
                                    },
                                ].map((section, i) => (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-2", children: section.title }), _jsx("ul", { className: "space-y-2 text-sm", children: section.links.map((link) => (_jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-blue-500 transition", children: link }) }, link))) })] }, i))) })] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 shadow-inner mb-14 flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: `transition-all duration-700 ease-in-out transform ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`, children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800", children: slides[index].title }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: slides[index].text })] }), _jsxs("form", { onSubmit: handleSubscribe, className: "flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto", children: [_jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email", className: "px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm flex-1 w-full" }), _jsx("button", { type: "submit", disabled: loading, className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-semibold shadow disabled:opacity-50", children: loading ? "Subscribing..." : "Subscribe" })] }), message && _jsx("p", { className: "text-sm text-gray-700 mt-2", children: message })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-sm", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(FaEnvelope, { className: "text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800", children: "Email" }), _jsx("p", { children: "info@brainproolympiad.gmail" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(FaPhoneAlt, { className: "text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800", children: "Call Us" }), _jsx("p", { children: " +2347014433155 OR +2347079073879" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(FaMapMarkerAlt, { className: "text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800", children: "Address" }), _jsx("p", { children: "678 Trans-Amadi Layout, Port Harcourt" })] })] })] }), _jsxs("div", { className: "border-t border-gray-200 pt-6 text-center text-sm text-gray-500", children: [_jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " ", _jsx("span", { className: "font-semibold text-blue-600", children: "Brain Pro Olympiad" }), " \u2014 All Rights Reserved."] }), _jsx("div", { className: "flex justify-center gap-6 mt-3", children: ["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (_jsx("a", { href: "#", className: "hover:text-blue-500 transition", children: link }, link))) })] })] })] }));
};
export default Footer;
