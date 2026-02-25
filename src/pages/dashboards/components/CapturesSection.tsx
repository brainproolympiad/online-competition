// src/pages/components/CapturesSection.tsx
import React, { useState } from 'react';
import ImagePopup from './ImagePopup';

interface CapturesSectionProps {
  participantId: string;
  participantName: string;
  quizAttempts: any[];
}

const CapturesSection: React.FC<CapturesSectionProps> = ({ 
  participantId, 
  participantName, 
  quizAttempts 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Get all photo data from quiz attempts for this participant
  const allCaptures = quizAttempts
    .filter(attempt => attempt.photo_data && attempt.photo_data.length > 0)
    .flatMap(attempt => 
      attempt.photo_data.map((url: string, index: number) => ({
        url,
        attemptId: attempt.id,
        quizTitle: attempt.quizzes?.title || 'Unknown Quiz',
        timestamp: attempt.submitted_at || attempt.created_at,
        index
      }))
    );

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedImage(null);
  };

  if (allCaptures.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No proctoring captures available
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Proctoring Captures ({allCaptures.length})
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {allCaptures.map((capture, index) => (
          <div key={`${capture.attemptId}-${capture.index}`} className="text-center">
            <div 
              className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => handleImageClick(capture.url)}
            >
              <img 
                src={capture.url} 
                alt={`Capture ${index + 1}`}
                className="w-full h-20 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/100x80?text=Error';
                }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-600 truncate">
              Capture {index + 1}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {new Date(capture.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <ImagePopup 
        imageUrl={selectedImage || ''}
        isOpen={isPopupOpen}
        onClose={closePopup}
      />
    </div>
  );
};

export default CapturesSection;