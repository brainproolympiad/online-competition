import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/SignIn.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
const quotes = [
    "“Education is the most powerful weapon which you can use to change the world.” – Nelson Mandela",
    "“The beautiful thing about learning is that nobody can take it away from you.” – B.B. King",
    "“Success is not final, failure is not fatal: It is the courage to continue that counts.” – Winston Churchill",
    "“Intelligence plus character—that is the goal of true education.” – Martin Luther King Jr."
];
const images = [
    "/slider1.jpg",
    "/slider2.jpg",
    "/slider3.jpg"
];
const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [flyingObjects, setFlyingObjects] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    // Flying objects
    useEffect(() => {
        const objects = [];
        const types = ["math", "science", "physics", "chemistry", "biology"];
        for (let i = 0; i < (isMobile ? 8 : 15); i++) {
            objects.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                type: types[Math.floor(Math.random() * types.length)]
            });
        }
        setFlyingObjects(objects);
    }, [isMobile]);
    // Image slider
    useEffect(() => {
        const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % images.length), 5000);
        return () => clearInterval(interval);
    }, []);
    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email || !username || !password) {
            setLoading(false);
            Swal.fire({
                icon: "warning",
                title: "Incomplete Fields",
                text: "Please fill in all fields.",
                background: "#ffffff",
                color: "#374151",
                confirmButtonColor: "#8b5cf6"
            });
            return;
        }
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (email === adminEmail && username === adminUsername && password === adminPassword) {
            Swal.fire({
                icon: "success",
                title: "Admin Access Granted",
                text: "Redirecting to admin dashboard...",
                timer: 2000,
                showConfirmButton: false,
                background: "#ffffff",
                color: "#374151"
            });
            localStorage.setItem("user", JSON.stringify({ email, username, role: "admin" }));
            setTimeout(() => navigate("/admin-dashboard"), 2000);
        }
        else {
            Swal.fire({
                icon: "success",
                title: "Welcome Back!",
                text: `Signed in as ${username}`,
                timer: 2000,
                showConfirmButton: false,
                background: "#ffffff",
                color: "#374151"
            });
            localStorage.setItem("user", JSON.stringify({ email, username, role: "user" }));
            setTimeout(() => navigate("/dashboard"), 2000);
        }
        setLoading(false);
    };
    const getFlyingObjectIcon = (type) => {
        const icons = {
            math: "∫",
            science: "⚛️",
            physics: "Φ",
            chemistry: "⚗️",
            biology: "🧬"
        };
        return icons[type] || "★";
    };
    const getFlyingObjectColor = (type) => {
        const colors = {
            math: "text-purple-400",
            science: "text-blue-400",
            physics: "text-red-400",
            chemistry: "text-emerald-400",
            biology: "text-amber-400"
        };
        return colors[type] || "text-gray-400";
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col md:flex-row relative bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 z-0 overflow-hidden", children: [flyingObjects.map(obj => (_jsx("div", { className: `absolute text-2xl md:text-3xl opacity-10 hover:opacity-20 transition-opacity duration-300 ${getFlyingObjectColor(obj.type)}`, style: {
                            left: `${obj.x}%`,
                            top: `${obj.y}%`,
                            animation: `float${(obj.id % 3) + 1} ${15 + (obj.id % 10)}s ease-in-out infinite`,
                            animationDelay: `${obj.id * 0.5}s`
                        }, children: getFlyingObjectIcon(obj.type) }, obj.id))), _jsx("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" }), _jsx("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" }), _jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" })] }), _jsx("div", { className: "flex-1 flex items-center justify-center z-10 p-6 md:p-12", children: _jsxs("div", { className: "bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 border border-white/60 space-y-8 hover:shadow-3xl transition-all duration-500", children: [_jsxs("div", { className: "text-center space-y-4", children: [_jsxs("div", { className: "flex items-center justify-center space-x-4", children: [_jsx("img", { src: logo, alt: "BrainPro Olympiad", className: "w-16 h-16 drop-shadow-lg" }), _jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent", children: "BrainPro" })] }), _jsx("p", { className: "text-gray-600 text-lg font-medium", children: "Welcome Back" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Sign in to continue your learning journey" })] }), _jsxs("form", { onSubmit: handleSignIn, className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "Email address", className: "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 shadow-sm", required: true }), _jsx("div", { className: "absolute inset-y-0 right-3 flex items-center", children: _jsx("span", { className: "text-gray-400", children: "\uD83D\uDCE7" }) })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: username, onChange: e => setUsername(e.target.value), placeholder: "Username", className: "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 shadow-sm", required: true }), _jsx("div", { className: "absolute inset-y-0 right-3 flex items-center", children: _jsx("span", { className: "text-gray-400", children: "\uD83D\uDC64" }) })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "Password", className: "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 shadow-sm", required: true }), _jsx("div", { className: "absolute inset-y-0 right-3 flex items-center", children: _jsx("span", { className: "text-gray-400", children: "\uD83D\uDD12" }) })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 py-3.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Signing In..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Sign In" }), _jsx("span", { className: "text-lg", children: "\u2192" })] })) })] }), _jsxs("div", { className: "text-center space-y-4", children: [_jsxs("div", { className: "text-gray-500 text-sm", children: ["Don't have an account?", " ", _jsx("button", { onClick: () => navigate("/register"), className: "text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200", children: "Create Account" })] }), _jsx("div", { className: "text-xs text-gray-400", children: "By continuing, you agree to our Terms and Privacy Policy" })] })] }) }), _jsx("div", { className: "flex-1 relative hidden md:flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 to-blue-100", children: _jsxs("div", { className: "relative w-full h-full", children: [_jsx("div", { className: "absolute inset-0 bg-black/5" }), _jsx("div", { className: "relative z-10 h-full flex flex-col items-center justify-center p-12 text-center space-y-8", children: _jsxs("div", { className: "max-w-lg space-y-6", children: [_jsxs("div", { className: "inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg", children: [_jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-sm font-semibold text-purple-600", children: "BrainPro Olympiad" })] }), _jsx("blockquote", { className: "text-2xl font-light text-gray-700 leading-relaxed italic", children: quotes[currentSlide] }), _jsx("div", { className: "flex justify-center space-x-2", children: images.map((_, index) => (_jsx("button", { onClick: () => setCurrentSlide(index), className: `w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'bg-purple-500 w-8'
                                                : 'bg-gray-300 hover:bg-gray-400'}` }, index))) })] }) }), _jsx("div", { className: "absolute top-10 right-10 w-20 h-20 bg-white/30 rounded-full blur-xl" }), _jsx("div", { className: "absolute bottom-10 left-10 w-16 h-16 bg-white/30 rounded-full blur-xl" })] }) }), _jsx("div", { className: "md:hidden relative h-64 bg-gradient-to-r from-purple-50 to-blue-100", children: _jsx("div", { className: "absolute inset-0 flex items-center justify-center p-6 text-center", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-xs font-semibold text-purple-600", children: "BrainPro Olympiad" })] }), _jsx("p", { className: "text-gray-700 text-sm italic leading-relaxed", children: quotes[currentSlide] })] }) }) }), _jsx("style", { children: `
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-3deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
      ` })] }));
};
export default SignIn;
