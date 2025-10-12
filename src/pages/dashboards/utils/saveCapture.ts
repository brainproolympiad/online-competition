import { supabase } from "../../../supabaseClient";

export const saveCapture = async (
  quizId: string,
  participantId: string,
  photoData: string,
  sequenceNumber: number
) => {
  const { data, error } = await supabase.from("webcam_captures").insert([
    {
      quiz_id: quizId,
      participant_id: participantId,
      photo_data: photoData,
      sequence_number: sequenceNumber,
    },
  ]);

  if (error) console.error("Failed to save capture:", error);
  else console.log("Capture saved:", data);
};
