import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/adminDashboard/AdminContentManager.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Swal from "sweetalert2";
const AdminContentManager = () => {
    const [winners, setWinners] = useState([]);
    const [finalists, setFinalists] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState("winners");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    // Load all data
    useEffect(() => {
        fetchAllData();
    }, []);
    const fetchAllData = async () => {
        setLoading(true);
        console.log("Fetching all content from Supabase...");
        try {
            const [wRes, fRes, sRes, mRes] = await Promise.all([
                supabase.from("alumni_winners").select("*").order("year", { ascending: false }),
                supabase.from("alumni_finalists").select("*").order("year", { ascending: false }),
                supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
                supabase.from("messages").select("*").order("created_at", { ascending: false }),
            ]);
            if (wRes.error)
                console.error("Error loading winners:", wRes.error);
            if (fRes.error)
                console.error("Error loading finalists:", fRes.error);
            if (sRes.error)
                console.error("Error loading subscribers:", sRes.error);
            if (mRes.error)
                console.error("Error loading messages:", mRes.error);
            setWinners(wRes.data || []);
            setFinalists(fRes.data || []);
            setSubscribers(sRes.data || []);
            setMessages(mRes.data || []);
        }
        catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire("Error", "Failed to load data", "error");
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (table, id, name = "record") => {
        const result = await Swal.fire({
            title: "Are you sure?",
            html: `You are about to delete <strong>${name}</strong>. This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed)
            return;
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) {
            Swal.fire("Error", error.message, "error");
        }
        else {
            Swal.fire("Deleted!", "Record has been removed successfully.", "success");
            fetchAllData();
        }
    };
    const viewMessage = (message) => {
        Swal.fire({
            title: `Message from ${message.name}`,
            html: `
        <div class="text-left">
          <p><strong>Email:</strong> ${message.email}</p>
          <p><strong>Date:</strong> ${new Date(message.created_at).toLocaleString()}</p>
          <hr class="my-4">
          <p class="mt-4 whitespace-pre-wrap">${message.message}</p>
        </div>
      `,
            width: isMobile ? "90%" : 600,
            showCloseButton: true,
            showConfirmButton: false,
        });
    };
    const exportToCSV = (data, filename) => {
        if (data.length === 0) {
            Swal.fire("Info", "No data to export", "info");
            return;
        }
        const headers = Object.keys(data[0]).join(",");
        const csvData = data.map(row => Object.values(row).map(value => typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value).join(",")).join("\n");
        const csv = `${headers}\n${csvData}`;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    const getFilteredData = () => {
        const data = {
            winners,
            finalists,
            subscribers,
            messages
        }[activeTab];
        if (!searchTerm)
            return data;
        return data.filter((item) => Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase())));
    };
    const StatsCard = ({ title, count, color, icon }) => (_jsx("div", { className: `bg-white rounded-xl shadow-sm p-4 border-l-4 ${color}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs md:text-sm font-medium text-gray-600", children: title }), _jsx("p", { className: "text-xl md:text-2xl font-bold text-gray-900", children: count })] }), _jsx("div", { className: "text-lg md:text-xl", children: icon })] }) }));
    const TabButton = ({ tab, label, icon }) => (_jsxs("button", { onClick: () => {
            setActiveTab(tab);
            setSearchTerm("");
        }, className: `flex items-center px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium transition-all flex-1 min-w-0 ${activeTab === tab
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-50 border"}`, children: [_jsx("span", { className: "mr-2 text-sm md:text-lg", children: icon }), _jsx("span", { className: "text-xs md:text-sm truncate", children: label })] }));
    // Mobile Card Views
    const WinnerCard = ({ winner }) => (_jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4 mb-3", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("img", { src: winner.photo, alt: winner.name, className: "w-12 h-12 rounded-full object-cover flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-semibold text-gray-900 truncate", children: winner.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [winner.year, " \u2022 ", winner.position] }), _jsxs("p", { className: "text-sm text-gray-600 truncate", children: [winner.school, ", ", winner.state] })] }), _jsx("button", { onClick: () => handleDelete("alumni_winners", winner.id, winner.name), className: "px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-shrink-0", children: "Delete" })] }) }));
    const FinalistCard = ({ finalist }) => (_jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4 mb-3", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("img", { src: finalist.photo, alt: finalist.name, className: "w-12 h-12 rounded-full object-cover flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-semibold text-gray-900 truncate", children: finalist.name }), _jsx("p", { className: "text-sm text-gray-600", children: finalist.year }), _jsxs("p", { className: "text-sm text-gray-600 truncate", children: [finalist.school, ", ", finalist.state] })] }), _jsx("button", { onClick: () => handleDelete("alumni_finalists", finalist.id, finalist.name), className: "px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-shrink-0", children: "Delete" })] }) }));
    const SubscriberCard = ({ subscriber }) => (_jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4 mb-3", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-gray-900 truncate", children: subscriber.email }), _jsx("p", { className: "text-sm text-gray-600", children: new Date(subscriber.subscribed_at).toLocaleDateString() })] }), _jsx("button", { onClick: () => handleDelete("newsletter_subscribers", subscriber.id, subscriber.email), className: "px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-shrink-0 ml-2", children: "Delete" })] }) }));
    const MessageCard = ({ message }) => (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-4 mb-3", children: [_jsx("div", { className: "flex justify-between items-start mb-2", children: _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-semibold text-gray-900 truncate", children: message.name }), _jsx("p", { className: "text-sm text-gray-600 truncate", children: message.email }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(message.created_at).toLocaleDateString() })] }) }), _jsx("p", { className: "text-sm text-gray-700 mb-3 line-clamp-2", children: message.message }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => viewMessage(message), className: "px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors flex-1", children: "View Message" }), _jsx("button", { onClick: () => handleDelete("messages", message.id, `message from ${message.name}`), className: "px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-1", children: "Delete" })] })] }));
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading content..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 p-3 md:p-6", children: [_jsxs("div", { className: "mb-6 md:mb-8", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold text-gray-900 mb-2", children: "Content Manager" }), _jsx("p", { className: "text-gray-600 text-sm md:text-base", children: "Manage alumni data, subscribers, and messages" })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8", children: [_jsx(StatsCard, { title: "Winners", count: winners.length, color: "border-green-500", icon: "\uD83C\uDFC6" }), _jsx(StatsCard, { title: "Finalists", count: finalists.length, color: "border-purple-500", icon: "\uD83C\uDF93" }), _jsx(StatsCard, { title: "Subscribers", count: subscribers.length, color: "border-blue-500", icon: "\uD83D\uDCE7" }), _jsx(StatsCard, { title: "Messages", count: messages.length, color: "border-red-500", icon: "\uD83D\uDCAC" })] }), _jsxs("div", { className: "bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden", children: [_jsx("div", { className: "border-b", children: _jsxs("div", { className: "flex space-x-1 md:space-x-2 p-3 md:p-4 overflow-x-auto", children: [_jsx(TabButton, { tab: "winners", label: "Winners", icon: "\uD83C\uDFC6" }), _jsx(TabButton, { tab: "finalists", label: "Finalists", icon: "\uD83C\uDF93" }), _jsx(TabButton, { tab: "subscribers", label: "Subscribers", icon: "\uD83D\uDCE7" }), _jsx(TabButton, { tab: "messages", label: "Messages", icon: "\uD83D\uDCAC" })] }) }), _jsxs("div", { className: "p-3 md:p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3", children: [_jsxs("div", { className: "relative w-full sm:flex-1 sm:max-w-md", children: [_jsx("input", { type: "text", placeholder: `Search ${activeTab}...`, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" }), _jsx("div", { className: "absolute left-3 top-2.5 text-gray-400", children: "\uD83D\uDD0D" })] }), _jsxs("button", { onClick: () => exportToCSV(getFilteredData(), activeTab), className: "w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm mt-2 sm:mt-0", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDCE5" }), "Export CSV"] })] }), _jsx("div", { className: "p-3 md:p-4", children: isMobile ? (
                        /* Mobile Card View */
                        _jsxs("div", { children: [activeTab === "winners" && (_jsxs("div", { children: [getFilteredData().map((winner) => (_jsx(WinnerCard, { winner: winner }, winner.id))), getFilteredData().length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: searchTerm ? "No matching winners found." : "No winners data available." }))] })), activeTab === "finalists" && (_jsxs("div", { children: [getFilteredData().map((finalist) => (_jsx(FinalistCard, { finalist: finalist }, finalist.id))), getFilteredData().length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: searchTerm ? "No matching finalists found." : "No finalists data available." }))] })), activeTab === "subscribers" && (_jsxs("div", { children: [getFilteredData().map((subscriber) => (_jsx(SubscriberCard, { subscriber: subscriber }, subscriber.id))), getFilteredData().length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: searchTerm ? "No matching subscribers found." : "No subscribers data available." }))] })), activeTab === "messages" && (_jsxs("div", { children: [getFilteredData().map((message) => (_jsx(MessageCard, { message: message }, message.id))), getFilteredData().length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: searchTerm ? "No matching messages found." : "No messages available." }))] }))] })) : (
                        /* Desktop Table View */
                        _jsxs("div", { className: "overflow-x-auto", children: [activeTab === "winners" && (_jsxs("table", { className: "w-full min-w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Photo" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Year" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Position" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "School" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "State" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: getFilteredData().map((winner) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3", children: _jsx("img", { src: winner.photo, alt: winner.name, className: "w-10 h-10 rounded-full object-cover" }) }), _jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: winner.name }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: winner.year }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: winner.position }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: winner.school }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: winner.state }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => handleDelete("alumni_winners", winner.id, winner.name), className: "px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm", children: "Delete" }) })] }, winner.id))) })] })), activeTab === "finalists" && (_jsxs("table", { className: "w-full min-w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Photo" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Year" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "School" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "State" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: getFilteredData().map((finalist) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3", children: _jsx("img", { src: finalist.photo, alt: finalist.name, className: "w-10 h-10 rounded-full object-cover" }) }), _jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: finalist.name }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: finalist.year }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: finalist.school }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: finalist.state }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => handleDelete("alumni_finalists", finalist.id, finalist.name), className: "px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm", children: "Delete" }) })] }, finalist.id))) })] })), activeTab === "subscribers" && (_jsxs("table", { className: "w-full min-w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Subscribed Date" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: getFilteredData().map((subscriber) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: subscriber.email }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: new Date(subscriber.subscribed_at).toLocaleDateString() }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => handleDelete("newsletter_subscribers", subscriber.id, subscriber.email), className: "px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm", children: "Delete" }) })] }, subscriber.id))) })] })), activeTab === "messages" && (_jsxs("table", { className: "w-full min-w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "From" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Preview" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: getFilteredData().map((message) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: message.name }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: message.email }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: new Date(message.created_at).toLocaleDateString() }), _jsx("td", { className: "px-4 py-3 text-gray-600 max-w-xs", children: _jsx("div", { className: "truncate", children: message.message }) }), _jsxs("td", { className: "px-4 py-3 space-x-2", children: [_jsx("button", { onClick: () => viewMessage(message), className: "px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm", children: "View" }), _jsx("button", { onClick: () => handleDelete("messages", message.id, `message from ${message.name}`), className: "px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm", children: "Delete" })] })] }, message.id))) })] })), getFilteredData().length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: searchTerm ? "No matching records found." : `No ${activeTab} data available.` }))] })) })] })] }));
};
export default AdminContentManager;
