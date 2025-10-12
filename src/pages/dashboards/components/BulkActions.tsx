import React from "react";
import Swal from "sweetalert2";
import { supabase } from "../../../supabaseClient";

interface BulkActionsProps {
  selectedIds: string[];
  fetchParticipants: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedIds, fetchParticipants }) => {

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

    if (!quizLink) return;

    try {
      const { error } = await supabase
        .from("registrations")
        .update({ quiz_link: quizLink }) // ✅ correct column
        .in("id", selectedIds);

      if (error) throw error;

      Swal.fire("Success", `Quiz link assigned to ${selectedIds.length} participants`, "success");
      fetchParticipants(); // refresh table
    } catch (err: any) {
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

    if (!confirm.isConfirmed) return;

    try {
      const { error } = await supabase
        .from("registrations")
        .update({ quiz_link: null });

      if (error) throw error;

      Swal.fire("Cleared", "All quiz links have been removed", "success");
      fetchParticipants();
    } catch (err: any) {
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

    if (!confirm.isConfirmed) return;

    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .in("id", selectedIds);

      if (error) throw error;

      Swal.fire("Deleted", `${selectedIds.length} participants removed`, "success");
      fetchParticipants();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <button
        onClick={handleAssignQuizLink}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Assign Quiz Link
      </button>

      <button
        onClick={handleRemoveAllQuizLinks}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Remove All Quiz Links
      </button>

      <button
        onClick={handleDeleteSelected}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Delete Selected
      </button>
    </div>
  );
};

export default BulkActions;
