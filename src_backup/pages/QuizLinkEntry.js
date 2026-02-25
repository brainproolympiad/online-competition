import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/QuizLinkEntry.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
const QuizLinkEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const participant = location.state?.participant;
    const [quizLink, setQuizLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [flyingObjects, setFlyingObjects] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    // Check mobile device
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    // Generate flying objects
    useEffect(() => {
        const objects = [];
        const types = ['math', 'science', 'physics', 'chemistry', 'biology'];
        for (let i = 0; i < (isMobile ? 6 : 10); i++) {
            objects.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                type: types[Math.floor(Math.random() * types.length)]
            });
        }
        setFlyingObjects(objects);
    }, [isMobile]);
    // Redirect if no participant data
    useEffect(() => {
        if (!participant) {
            navigate("/quiz-login");
        }
    }, [participant, navigate]);
    const extractQuizId = (url) => {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const quizId = pathParts[pathParts.length - 1];
            return quizId || null;
        }
        catch {
            // If it's not a valid URL, treat it as a direct quiz ID
            return url.trim() || null;
        }
    };
    const handleStartQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!quizLink.trim()) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Quiz Link Required",
                text: "Please enter your quiz link or ID",
                background: '#0a0a0a',
                color: '#fff',
                confirmButtonColor: '#8b5cf6'
            });
            return;
        }
        const quizId = extractQuizId(quizLink);
        if (!quizId) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Invalid Quiz Link",
                text: "Please check your quiz link and try again",
                background: '#0a0a0a',
                color: '#fff',
                confirmButtonColor: '#8b5cf6'
            });
            return;
        }
        // Simulate validation
        await new Promise(resolve => setTimeout(resolve, 1500));
        Swal.fire({
            icon: "success",
            title: "Quiz Link Validated",
            text: "Initializing proctored session...",
            timer: 2000,
            showConfirmButton: false,
            background: '#0a0a0a',
            color: '#fff'
        });
        setTimeout(() => {
            navigate(`/quiz/${quizId}`, {
                state: {
                    participant: participant,
                    quizId: quizId,
                },
                replace: true
            });
        }, 2000);
    };
    const getFlyingObjectIcon = (type) => {
        switch (type) {
            case 'math': return '∫';
            case 'science': return '⚛';
            case 'physics': return 'Φ';
            case 'chemistry': return '⚗';
            case 'biology': return '🧬';
            default: return '★';
        }
    };
    const handleExampleClick = () => {
        setQuizLink("https://brainpro.org/quiz/olympiad-2024-math-challenge");
    };
    if (!participant) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center", children: _jsxs("div", { className: "text-white text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" }), _jsx("p", { children: "Redirecting to login..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 overflow-hidden", children: flyingObjects.map((obj) => (_jsx("div", { className: `absolute text-lg md:text-xl opacity-20 md:opacity-30 font-bold animate-float-${obj.id % 3}`, style: {
                        left: `${obj.x}%`,
                        top: `${obj.y}%`,
                        animationDelay: `${obj.id * 0.7}s`,
                        animationDuration: `${18 + (obj.id % 12)}s`,
                        color: obj.type === 'math' ? '#8b5cf6' :
                            obj.type === 'science' ? '#06b6d4' :
                                obj.type === 'physics' ? '#ef4444' :
                                    obj.type === 'chemistry' ? '#10b981' : '#f59e0b'
                    }, children: getFlyingObjectIcon(obj.type) }, obj.id))) }), _jsxs("div", { className: "relative bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl p-6 md:p-8 border border-gray-700/50 animate-fadeIn", children: [_jsxs("div", { className: "text-center mb-6 md:mb-8", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2", children: "Enter Quiz Link" }), _jsxs("p", { className: "text-gray-400 text-sm md:text-base", children: ["Welcome back, ", _jsx("span", { className: "text-white font-semibold", children: participant.name })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8", children: [_jsxs("div", { className: "space-y-4 md:space-y-6", children: [_jsxs("div", { className: "bg-gray-700/50 border border-gray-600 rounded-xl p-4 md:p-6", children: [_jsxs("h3", { className: "text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center", children: [_jsx("span", { className: "text-purple-400 mr-2", children: "\uD83D\uDCCB" }), "Instructions"] }), _jsxs("ul", { className: "space-y-2 md:space-y-3 text-sm md:text-base text-gray-300", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "text-green-400 mr-2 mt-1", children: "\u2713" }), _jsx("span", { children: "Enter the quiz link provided by your instructor" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "text-green-400 mr-2 mt-1", children: "\u2713" }), _jsx("span", { children: "Ensure you have stable internet connection" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "text-green-400 mr-2 mt-1", children: "\u2713" }), _jsx("span", { children: "Close all other applications and browser tabs" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "text-green-400 mr-2 mt-1", children: "\u2713" }), _jsx("span", { children: "Prepare your identification if required" })] })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/40 rounded-xl p-4 md:p-6", children: [_jsxs("h4", { className: "text-white font-semibold mb-3 flex items-center", children: [_jsx("span", { className: "text-blue-400 mr-2", children: "\uD83D\uDC64" }), "Participant Information"] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400", children: "Name" }), _jsx("p", { className: "text-white font-medium", children: participant.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400", children: "Email" }), _jsx("p", { className: "text-white font-medium truncate", children: participant.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400", children: "Status" }), _jsx("p", { className: "text-green-400 font-medium", children: "Verified \u2713" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400", children: "Session" }), _jsx("p", { className: "text-yellow-400 font-medium", children: "Ready" })] })] })] })] }), _jsxs("div", { className: "space-y-4 md:space-y-6", children: [_jsxs("div", { className: "bg-gray-700/50 border border-gray-600 rounded-xl p-4 md:p-6", children: [_jsxs("h3", { className: "text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center", children: [_jsx("span", { className: "text-blue-400 mr-2", children: "\uD83D\uDD17" }), "Quiz Link Entry"] }), _jsxs("form", { onSubmit: handleStartQuiz, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-300 mb-2 font-medium text-sm md:text-base", children: "Quiz Link or ID" }), _jsx("input", { type: "text", value: quizLink, onChange: (e) => setQuizLink(e.target.value), placeholder: "https://brainpro.org/quiz/your-quiz-id", className: "w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base font-mono" }), _jsx("button", { type: "button", onClick: handleExampleClick, className: "text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors", children: "Click to see example format" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 md:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center space-x-2 text-sm md:text-base", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Validating Quiz Link..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-lg" }), _jsx("span", { children: "Start Proctored Session" })] })) })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => navigate("/quiz-login"), className: "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 text-white py-2 md:py-3 rounded-xl font-medium transition-all text-sm md:text-base flex items-center justify-center space-x-2", children: [_jsx("span", { children: "\u2190" }), _jsx("span", { children: "Back to Login" })] }), _jsxs("button", { onClick: () => Swal.fire({
                                                    title: "Need Help?",
                                                    html: `
                    <div class="text-left text-sm">
                      <p class="mb-3"><strong>Where to find your quiz link:</strong></p>
                      <ul class="list-disc list-inside space-y-1 mb-3">
                        <li>Check your email from BrainPro Olympiad</li>
                        <li>Contact your instructor or coordinator</li>
                        <li>Visit your student dashboard</li>
                      </ul>
                      <p class="text-yellow-400">Support: help@brainpro.org</p>
                    </div>
                  `,
                                                    icon: "info",
                                                    background: '#0a0a0a',
                                                    color: '#fff',
                                                    confirmButtonColor: '#8b5cf6'
                                                }), className: "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 text-white py-2 md:py-3 rounded-xl font-medium transition-all text-sm md:text-base flex items-center justify-center space-x-2", children: [_jsx("span", { children: "?" }), _jsx("span", { children: "Get Help" })] })] })] })] }), _jsx("div", { className: "mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-700/50", children: _jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between text-xs md:text-sm text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2 sm:mb-0", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { children: "Proctoring System: Active" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { children: "\uD83D\uDD12 Secure Connection" }), _jsx("span", { children: "\uD83D\uDCF9 Camera Ready" }), _jsx("span", { children: "\uD83C\uDFA4 Audio Ready" })] })] }) })] }), _jsx("style", { children: `
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-10px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(5px) rotate(240deg) scale(0.9); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          50% { transform: translateX(15px) translateY(-20px) rotate(180deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(-20px) scale(1.2) rotate(360deg); }
        }
        .animate-float-0 { animation: float1 20s ease-in-out infinite; }
        .animate-float-1 { animation: float2 25s ease-in-out infinite; }
        .animate-float-2 { animation: float3 15s ease-in-out infinite; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-float-0, .animate-float-1, .animate-float-2 {
            animation-duration: 12s !important;
          }
        }
      ` })] }));
};
export default QuizLinkEntry;
