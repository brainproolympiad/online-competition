import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const HorizontalStudentBenefits = () => {
    const [selectedBenefit, setSelectedBenefit] = useState(null);
    const benefits = [
        {
            id: 1,
            title: "Exclusive Scholarships",
            excerpt: "Special scholarship opportunities for high-performing students.",
            fullContent: "We've established partnerships with over 50 universities worldwide to provide exclusive scholarship opportunities for our members. These scholarships range from partial tuition coverage to full-ride opportunities for exceptional students.",
            imageUrl: "https://orientalnewsng.com/wp-content/uploads/2018/05/AK-1.jpg",
            icon: "",
            category: "Financial"
        },
        {
            id: 2,
            title: "Personalized Learning",
            excerpt: "AI-driven paths adapt to your strengths and weaknesses.",
            fullContent: "Our advanced AI system analyzes your performance across subjects and creates personalized learning paths tailored to your specific needs. The algorithm identifies knowledge gaps and suggests targeted exercises.",
            imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQGtlqQ-XNJLAQ/feedshare-shrink_2048_1536/B4DZaGVpmNH4Ao-/0/1746010566303?e=1762992000&v=beta&t=4EkKZseNB4FHe8ixuNbqaV4p71lg68RfikQ_xYMoTsQ",
            icon: "",
            category: "Academic"
        },
        {
            id: 3,
            title: "Career Mentorship",
            excerpt: "Connect with industry professionals for guidance.",
            fullContent: "Our mentorship program pairs students with experienced professionals in their field of interest. Through regular virtual meetings, mentors provide guidance on career choices, educational paths, and professional development.",
            imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQHfA3Rhi91X1w/feedshare-shrink_2048_1536/B4DZZ8lSAoG4As-/0/1745846886528?e=1762992000&v=beta&t=5eMmw5SOTaat076vwel-khkoX6mDmo85wr7KwROtuaY",
            icon: "",
            category: "Career"
        },
        {
            id: 4,
            title: "Global Community",
            excerpt: "Join a diverse network of students worldwide.",
            fullContent: "When you join our platform, you become part of a global community of over 500,000 students from 120 countries. This diverse network allows for cultural exchange, collaborative learning, and international friendship.",
            imageUrl: "https://plus.unsplash.com/premium_photo-1681494736199-9a671f75ade3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyNHx8fGVufDB8fHx8fA%3D%3D",
            icon: "",
            category: "Network"
        }
    ];
    const openModal = (benefit) => {
        setSelectedBenefit(benefit);
        document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
        setSelectedBenefit(null);
        document.body.style.overflow = 'auto';
    };
    return (_jsxs("div", { className: "bg-gray-50 py-12 px-4 md:px-8", children: [_jsx("div", { className: "max-w-6xl mx-auto", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: benefits.map((benefit) => (_jsxs("div", { className: "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full", children: [_jsx("div", { className: "h-40 overflow-hidden cursor-pointer", onClick: () => openModal(benefit), children: _jsx("img", { src: benefit.imageUrl, alt: benefit.title, className: "w-full h-full object-cover transition-transform duration-300 hover:scale-105" }) }), _jsxs("div", { className: "p-5 flex flex-col flex-grow", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-2xl", children: benefit.icon }), _jsx("span", { className: "text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full", children: benefit.category })] }), _jsx("h3", { className: "text-lg font-bold text-gray-800 mb-2", children: benefit.title }), _jsx("p", { className: "text-sm text-gray-600 mb-4 flex-grow", children: benefit.excerpt }), _jsxs("button", { onClick: () => openModal(benefit), className: "text-sm text-blue-600 font-semibold flex items-center hover:text-blue-800 transition-colors mt-auto", children: ["Read more", _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 ml-1", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z", clipRule: "evenodd" }) })] })] })] }, benefit.id))) }) }), selectedBenefit && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 mt-24", children: _jsxs("div", { className: "bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: selectedBenefit.imageUrl, alt: selectedBenefit.title, className: "w-full h-48 object-cover rounded-t-xl" }), _jsx("button", { onClick: closeModal, className: "absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-gray-700", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-3xl", children: selectedBenefit.icon }), _jsx("span", { className: "text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full", children: selectedBenefit.category })] }), _jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-4", children: selectedBenefit.title }), _jsx("div", { className: "text-gray-700 space-y-3", children: _jsx("p", { children: selectedBenefit.fullContent }) }), _jsx("div", { className: "mt-6 pt-4 border-t border-gray-200", children: _jsx("button", { onClick: closeModal, className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm", children: "Close" }) })] })] }) }))] }));
};
export default HorizontalStudentBenefits;
