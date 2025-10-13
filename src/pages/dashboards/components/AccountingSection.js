import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/components/AccountingSection.tsx
import React from "react";
import Swal from "sweetalert2";
import { supabase } from "../../../supabaseClient";
const AccountingSection = ({ totalRevenue, filteredParticipants, selectedParticipants, setSelectedParticipants, addDebugLog, participants, updateParticipants }) => {
    const handleBulkQuizLinks = async () => {
        if (selectedParticipants.size === 0) {
            Swal.fire("Warning", "Please select participants first", "warning");
            return;
        }
        const { value: link } = await Swal.fire({
            title: "Bulk Update Quiz Links",
            input: "url",
            inputLabel: `Set quiz link for ${selectedParticipants.size} participants`,
            inputPlaceholder: "https://example.com/quiz/abc",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value)
                    return 'Please enter a URL';
                if (!value.startsWith('http')) {
                    return 'Please enter a valid URL starting with http:// or https://';
                }
                return null;
            }
        });
        if (!link)
            return;
        addDebugLog("BULK_QUIZ_LINKS_START", undefined, { participantCount: selectedParticipants.size, link });
        const { error } = await supabase
            .from("registrations")
            .update({ quiz_link: link })
            .in("id", Array.from(selectedParticipants));
        if (error) {
            addDebugLog("BULK_QUIZ_LINKS_ERROR", undefined, undefined, error.message);
            Swal.fire("Error", error.message, "error");
        }
        else {
            addDebugLog("BULK_QUIZ_LINKS_SUCCESS", undefined, { updatedCount: selectedParticipants.size });
            const updatedParticipants = participants.map(p => selectedParticipants.has(p.id) ? { ...p, quizLink: link } : p);
            updateParticipants(updatedParticipants);
            Swal.fire("Success", `Quiz links updated for ${selectedParticipants.size} participants!`, "success");
            setSelectedParticipants(new Set());
        }
    };
    const handleBulkEmail = async () => {
        if (selectedParticipants.size === 0) {
            Swal.fire("Warning", "Please select participants first", "warning");
            return;
        }
        const selectedEmails = filteredParticipants
            .filter(p => selectedParticipants.has(p.id))
            .map(p => p.email);
        const { value: emailContent } = await Swal.fire({
            title: "Bulk Email",
            input: "textarea",
            inputLabel: `Email content for ${selectedParticipants.size} participants`,
            inputPlaceholder: "Enter your message here...",
            inputAttributes: {
                rows: "6"
            },
            showCancelButton: true,
            inputValidator: (value) => !value && "Please enter email content"
        });
        if (emailContent) {
            Swal.fire({
                title: "Email Prepared",
                html: `
          <div class="text-left">
            <p><strong>Recipients:</strong> ${selectedParticipants.size} participants</p>
            <p><strong>Sample emails:</strong></p>
            <div style="max-height: 100px; overflow-y: auto; background: #f5f5f5; padding: 8px; border-radius: 4px;">
              ${selectedEmails.slice(0, 5).map(email => `<div>${email}</div>`).join('')}
              ${selectedEmails.length > 5 ? `<div>... and ${selectedEmails.length - 5} more</div>` : ''}
            </div>
            <p class="mt-3"><strong>Content Preview:</strong></p>
            <div style="max-height: 80px; overflow-y: auto; background: #f5f5f5; padding: 8px; border-radius: 4px;">
              ${emailContent.substring(0, 200)}${emailContent.length > 200 ? '...' : ''}
            </div>
          </div>
        `,
                icon: "info",
                confirmButtonText: "OK"
            });
        }
    };
    const handleClearAllLinks = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will remove all quiz links for all participants!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete all",
        });
        if (result.isConfirmed) {
            addDebugLog("CLEAR_ALL_LINKS_START");
            const { error } = await supabase.from("registrations").update({ quiz_link: null });
            if (error) {
                addDebugLog("CLEAR_ALL_LINKS_ERROR", undefined, undefined, error.message);
                Swal.fire("Error", error.message, "error");
            }
            else {
                addDebugLog("CLEAR_ALL_LINKS_SUCCESS");
                const updatedParticipants = participants.map(p => ({ ...p, quizLink: null }));
                updateParticipants(updatedParticipants);
                Swal.fire("Success", "All quiz links cleared!", "success");
            }
        }
    };
    const exportToCSV = (data) => {
        const headers = ["Name", "Email", "Class", "Courses", "Paid", "Amount Paid", "Total Score", "Average Score", "Quiz Link"];
        const csvData = data.map(p => [
            p.fullName,
            p.email,
            p.classLevel,
            p.courses.join("; "),
            p.paid ? "Yes" : "No",
            p.amountPaid || 0,
            p.totalScore || 0,
            p.averageScore || 0,
            p.quizLink || "Not set"
        ]);
        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.map(field => `"${field}"`).join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `participants-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "mb-6 flex flex-wrap justify-between items-center bg-white p-4 rounded shadow gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-lg", children: "Accounting" }), _jsxs("p", { className: "text-green-600 font-semibold text-lg", children: ["Total Revenue: \u20A6", totalRevenue.toLocaleString()] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => exportToCSV(filteredParticipants), className: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition", children: "Export to CSV" }), _jsx("button", { onClick: handleClearAllLinks, className: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition", children: "Clear All Quiz Links" }), _jsx("button", { onClick: handleBulkQuizLinks, className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition", children: "Bulk Quiz Links" }), _jsx("button", { onClick: handleBulkEmail, className: "bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500 transition", children: "Bulk Email" })] })] }));
};
export default AccountingSection;
