// src/pages/components/CapturesButton.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Swal from 'sweetalert2';

interface WebcamCapture {
  id: string;
  photo_data: string;
  sequence_number: number;
  captured_at: string;
  participant_id: string;
  quiz_attempt_id: string | null;
  registrations?: { fullName?: string; email?: string } | null;
  quiz_attempts?: { id?: string; quizzes?: { title?: string; subject?: string } | null } | null;
}

interface CapturesButtonProps {
  participantId?: string;     // optional to allow searching by attempt id alone
  participantName?: string;
  quizAttemptId?: string;
  showCount?: boolean;
}

const CapturesButton: React.FC<CapturesButtonProps> = ({
  participantId,
  participantName = 'Participant',
  quizAttemptId,
  showCount = true,
}) => {
  const [captures, setCaptures] = useState<WebcamCapture[]>([]);
  const [captureCount, setCaptureCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // preload a lightweight count if possible (non-blocking)
  useEffect(() => {
    const fetchCount = async () => {
      try {
        // If we have neither identifier, skip count (button still clickable)
        if (!participantId && !quizAttemptId) {
          setCaptureCount(null);
          return;
        }

        // If both, use OR so we count anything matching either
        if (participantId && quizAttemptId) {
          const { count, error } = await supabase
            .from('webcam_captures')
            .select('id', { count: 'exact' })
            .or(`participant_id.eq.${participantId},quiz_attempt_id.eq.${quizAttemptId}`);

          if (error) {
            console.warn('Count error:', error);
            setCaptureCount(null);
          } else {
            setCaptureCount(count || 0);
          }
          return;
        }

        // otherwise use whichever identifier we have
        const query = supabase.from('webcam_captures').select('id', { count: 'exact' });
        const res =
          participantId
            ? await query.eq('participant_id', participantId)
            : await query.eq('quiz_attempt_id', quizAttemptId);

        if ((res as any).error) {
          console.warn('Count query error:', (res as any).error);
          setCaptureCount(null);
        } else {
          setCaptureCount((res as any).count || 0);
        }
      } catch (err) {
        console.error('Error fetching capture count:', err);
        setCaptureCount(null);
      }
    };

    fetchCount();
  }, [participantId, quizAttemptId]);

  // fetch captures using whichever identifiers are available (participantId and/or quizAttemptId)
  const fetchCaptures = async () => {
    setLoading(true);
    try {
      if (!participantId && !quizAttemptId) {
        // Nothing to search by
        Swal.fire('Missing identifier', 'No participantId or quizAttemptId supplied.', 'warning');
        setLoading(false);
        return;
      }

      // Build the SELECT to include related quiz_attempts -> quizzes and registrations
      let query = supabase
        .from('webcam_captures')
        .select(`
          id,
          photo_data,
          sequence_number,
          captured_at,
          participant_id,
          quiz_attempt_id,
          registrations ( id, "fullName", email ),
          quiz_attempts ( id, quiz_id, quizzes ( title, subject ) )
        `)
        .order('sequence_number', { ascending: true });

      // If both supplied, use OR to find captures matching either
      if (participantId && quizAttemptId) {
        query = query.or(`participant_id.eq.${participantId},quiz_attempt_id.eq.${quizAttemptId}`);
      } else if (participantId) {
        query = query.eq('participant_id', participantId);
      } else if (quizAttemptId) {
        query = query.eq('quiz_attempt_id', quizAttemptId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const valid = (data || []).filter((c: any) => c.photo_data && c.photo_data.toString().trim().length > 0);

      setCaptures(valid as WebcamCapture[]);
      setCaptureCount(valid.length);

      if (valid.length === 0) {
        Swal.fire({
          title: 'No Captures Found',
          html: `
            <div style="text-align:left">
              <p><strong>Participant:</strong> ${participantName}</p>
              <p><strong>Participant ID:</strong> ${participantId ?? '—'}</p>
              <p><strong>Quiz Attempt ID:</strong> ${quizAttemptId ?? '—'}</p>
              <p class="mt-2">No webcam captures matched the provided identifiers.</p>
            </div>
          `,
          icon: 'info'
        });
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error fetching captures:', err);
      Swal.fire('Error', 'Failed to load captures. Check console for details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowCaptures = async () => {
    // Always allow click — we will show helpful messages inside fetchCaptures if nothing to search
    await fetchCaptures();
  };

  const downloadImage = (base64Data: string, filename: string) => {
    try {
      let url = base64Data;
      if (base64Data && !base64Data.startsWith('data:')) {
        // common base64 prefixes
        if (base64Data.startsWith('/9j/') || base64Data.startsWith('ffd8')) {
          url = `data:image/jpeg;base64,${base64Data}`;
        } else if (base64Data.startsWith('iVBOR')) {
          url = `data:image/png;base64,${base64Data}`;
        }
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error', err);
      Swal.fire('Error', 'Failed to download image', 'error');
    }
  };

  // group by quiz_attempt_id
  const groupedCaptures = captures.reduce((acc: Record<string, { quizTitle: string; captures: WebcamCapture[] }>, c) => {
    const key = c.quiz_attempt_id || 'no-attempt';
    if (!acc[key]) acc[key] = { quizTitle: c.quiz_attempts?.quizzes?.title || 'Unknown Quiz', captures: [] };
    acc[key].captures.push(c);
    return acc;
  }, {});

  return (
    <>
      <button
        onClick={handleShowCaptures}
        disabled={loading}                         // only disabled while loading, always clickable otherwise
        className="relative bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        title={`Click to view captures (${participantId ?? 'no participantId'}, ${quizAttemptId ?? 'no attemptId'})`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            View Captures
            {showCount && captureCount !== null && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {captureCount}
              </span>
            )}
          </>
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">Webcam Captures</h3>
                <p className="text-sm text-gray-600">{participantName} • {captures.length} captures</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // download all
                    captures.forEach((cap, i) => {
                      const data = cap.photo_data;
                      const date = new Date(cap.captured_at).toISOString().split('T')[0];
                      const safe = (participantName || 'participant').replace(/[^a-zA-Z0-9]/g, '_');
                      const quizTitle = cap.quiz_attempts?.quizzes?.title || 'quiz';
                      const filename = `${safe}_${quizTitle.replace(/[^a-zA-Z0-9]/g, '_')}_capture_${cap.sequence_number}_${date}.jpg`;
                      downloadImage(data, filename);
                    });
                    Swal.fire('Started', `Started download of ${captures.length} images`, 'success');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                >
                  Download All
                </button>
                <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600">Close</button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] space-y-6">
              {captures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No captures to display.</p>
                </div>
              ) : (
                Object.entries(groupedCaptures).map(([attemptId, group]) => (
                  <div key={attemptId} className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-2 border-b">
                      <h4 className="font-semibold text-blue-800">{group.quizTitle}</h4>
                      <p className="text-sm text-blue-600">{group.captures.length} captures • Attempt: {attemptId === 'no-attempt' ? 'Not Linked' : attemptId.slice(0, 8)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                      {group.captures.map((cap) => (
                        <div key={cap.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                          <img
                            src={
                              cap.photo_data.startsWith('data:')
                                ? cap.photo_data
                                : cap.photo_data.startsWith('/9j/') || cap.photo_data.startsWith('iVBOR')
                                ? (cap.photo_data.startsWith('/9j/') ? `data:image/jpeg;base64,${cap.photo_data}` : `data:image/png;base64,${cap.photo_data}`)
                                : cap.photo_data
                            }
                            alt={`Capture ${cap.sequence_number}`}
                            className="w-full h-48 object-cover bg-gray-100"
                          />
                          <div className="p-2 text-sm text-gray-600">
                            <div className="flex justify-between items-center mb-1">
                              <span>#{cap.sequence_number}</span>
                              <span>{new Date(cap.captured_at).toLocaleTimeString()}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">{new Date(cap.captured_at).toLocaleDateString()}</div>
                            <button
                              onClick={() => {
                                const date = new Date(cap.captured_at).toISOString().split('T')[0];
                                const filename = `${(participantName || 'participant').replace(/[^a-zA-Z0-9]/g, '_')}_capture_${cap.sequence_number}_${date}.jpg`;
                                downloadImage(cap.photo_data, filename);
                              }}
                              className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CapturesButton;
