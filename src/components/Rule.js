import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
const Rules = () => {
    const [activeTab, setActiveTab] = useState('rules');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    // ✅ Fetch FAQ data from Supabase
    useEffect(() => {
        const fetchFAQs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('id', { ascending: true });
            if (error) {
                console.error('Error fetching FAQs:', error.message);
            }
            else {
                setFaqData(data || []);
            }
            setLoading(false);
        };
        fetchFAQs();
    }, []);
    // ✅ Filter FAQ search
    const filteredFAQs = faqData.filter((faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const FAQsToShow = showAll || searchQuery
        ? filteredFAQs
        : filteredFAQs.slice(0, 10);
    return (_jsx("div", { className: "bg-gradient-to-b from-gray-50 to-blue-50 py-16 px-4 md:px-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("div", { className: "text-center mb-12", children: _jsxs("h2", { className: "text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4", children: ["Competition ", _jsx("span", { className: "text-blue-600", children: "Rules & FAQ" })] }) }), _jsx("div", { className: "flex justify-center mb-10", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-1 flex", children: [_jsx("button", { onClick: () => setActiveTab('rules'), className: `px-6 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'rules'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-blue-600'}`, children: "Competition Rules" }), _jsx("button", { onClick: () => setActiveTab('faq'), className: `px-6 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'faq'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-blue-600'}`, children: "Frequently Asked Questions" })] }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-6 md:p-8", children: [activeTab === 'rules' && (_jsxs("div", { className: "text-gray-800 space-y-6", children: [_jsx("h3", { className: "text-2xl font-bold mb-4 text-blue-800", children: "Competition Guidelines" }), _jsxs("ol", { className: "list-decimal pl-6 space-y-3 text-lg", children: [_jsx("li", { children: "All participants must be duly registered and verified before the competition." }), _jsx("li", { children: "Each round will be conducted under strict supervision using the official platform." }), _jsx("li", { children: "Participants are expected to maintain academic integrity \u2014 cheating leads to disqualification." }), _jsx("li", { children: "Use of unauthorized materials, gadgets, or communication during tests is strictly prohibited." }), _jsx("li", { children: "Ensure a stable internet connection before starting the test; interruptions are not excused." }), _jsx("li", { children: "Scoring is automated and based on accuracy and completion time." }), _jsx("li", { children: "Winners will be determined by total scores and may undergo verification." }), _jsx("li", { children: "Respect other participants and maintain decorum in all related communication channels." }), _jsx("li", { children: "The decision of the organizers is final in all matters concerning the competition." }), _jsx("li", { children: "Certificates and prizes will be awarded to outstanding candidates across categories." })] })] })), activeTab === 'faq' && (_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-6", children: "Frequently Asked Questions" }), _jsx("div", { className: "relative mb-8", children: _jsx("input", { type: "text", placeholder: "Search for questions or answers...", className: "block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }) }), loading ? (_jsx("div", { className: "text-center py-8 text-gray-600", children: "Loading FAQs..." })) : (_jsx("div", { className: "space-y-4", children: FAQsToShow.length > 0 ? (FAQsToShow.map((faq) => (_jsxs("div", { className: "border-b border-gray-200 pb-4 last:border-b-0", children: [_jsxs("button", { className: "flex justify-between items-center w-full text-left font-medium text-blue-800 hover:text-blue-600 focus:outline-none", onClick: () => setExpandedId(expandedId === faq.id ? null : faq.id), children: [_jsx("span", { children: faq.question }), _jsx("svg", { className: `h-5 w-5 transform transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) })] }), expandedId === faq.id && (_jsxs("div", { className: "mt-2 text-gray-700 pl-2", children: [_jsx("p", { children: faq.answer }), _jsx("div", { className: "mt-2", children: _jsx("span", { className: "text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full", children: faq.category }) })] }))] }, faq.id)))) : (_jsx("div", { className: "text-center py-8 text-gray-600", children: "No FAQs found." })) }))] }))] })] }) }));
};
export default Rules;
