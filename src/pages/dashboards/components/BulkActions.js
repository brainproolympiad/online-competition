import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Swal from "sweetalert2";
import { supabase } from "../../../supabaseClient";
const BulkActions = ({ selectedIds, fetchParticipants }) => {
    // ✅ Assign quiz link to selected participants
    const handleAssignQuizLink = async () => {
        if (selectedIds.length === 0) {
            Swal.fire("No Selection", "Please select at least one participant", "info");
            return;
        }
        const { value: quizLink } = await Swal.fire({
            title: "Assign Quiz Link",
            input: "url",
            inputLabel: "Enter the quiz URL",
            inputPlaceholder: "https://example.com/quiz",
            showCancelButton: true,
            confirmButtonText: "Assign",
        });
        if (!quizLink)
            return;
        try {
            const { error } = await supabase
                .from("registrations")
                .update({ quiz_link: quizLink }) // ✅ correct column
                .in("id", selectedIds);
            if (error)
                throw error;
            Swal.fire("Success", `Quiz link assigned to ${selectedIds.length} participants`, "success");
            fetchParticipants(); // refresh table
        }
        catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };
    // ✅ Remove quiz link from all participants
    const handleRemoveAllQuizLinks = async () => {
        const confirm = await Swal.fire({
            title: "Remove All Quiz Links?",
            text: "This will clear quiz links for every participant.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove all",
            cancelButtonText: "Cancel",
        });
        if (!confirm.isConfirmed)
            return;
        try {
            const { error } = await supabase
                .from("registrations")
                .update({ quiz_link: null });
            if (error)
                throw error;
            Swal.fire("Cleared", "All quiz links have been removed", "success");
            fetchParticipants();
        }
        catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };
    // ✅ Bulk delete selected participants
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            Swal.fire("No Selection", "Please select participants to delete", "info");
            return;
        }
        const confirm = await Swal.fire({
            title: "Delete Selected?",
            text: `You are about to delete ${selectedIds.length} participants.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });
        if (!confirm.isConfirmed)
            return;
        try {
            const { error } = await supabase
                .from("registrations")
                .delete()
                .in("id", selectedIds);
            if (error)
                throw error;
            Swal.fire("Deleted", `${selectedIds.length} participants removed`, "success");
            fetchParticipants();
        }
        catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };
    return (_jsxs("div", { className: "flex flex-wrap gap-3 mb-4", children: [_jsx("button", { onClick: handleAssignQuizLink, className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition", children: "Assign Quiz Link" }), _jsx("button", { onClick: handleRemoveAllQuizLinks, className: "bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition", children: "Remove All Quiz Links" }), _jsx("button", { onClick: handleDeleteSelected, className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition", children: "Delete Selected" })] }));
};
export default BulkActions;
