import React, { useState, useEffect } from "react";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setStepValid: (isValid: boolean) => void; // 
}

const CourseSelection: React.FC<Props> = ({ formData, setFormData, setStepValid }) => {
  const subjectsByCategory: Record<string, string[]> = {
    Primary: [
      "Basic Science",
      "Social Studies",
      "Verbal Reasoning",
      "Quantitative Reasoning",
      "Computer Studies",
      "Creative Arts",
    ],
    JuniorSecondary: [
      "Basic Science",
      "Basic Technology",
      "Computer Studies",
      "Home Economics",
      "Agricultural Science",
     
      
    ],
    SeniorSecondary: [
      "Physics",
      "Chemistry",
      "Biology",
      "Government",
      "Literature in English",
      "Financial Accounting",
      "Further Mathematics",  
      "Digital Technology",
      "Technical Drawing",
    ],
  };

  // Determine category based on class level
  const getCategoryFromClass = (classLevel: string) => {
    if (classLevel?.includes("Primary")) return "Primary";
    if (classLevel?.includes("JSS")) return "JuniorSecondary";
    if (classLevel?.includes("SS")) return "SeniorSecondary";
    return "";
  };

  const category = getCategoryFromClass(formData.classLevel);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(formData.courses || []);

  useEffect(() => {
    // Update form data when selected subjects change
    setFormData({ ...formData, courses: selectedSubjects });

    // ✅ Mark step valid only when 4 subjects (2 elective + 2 compulsory) are chosen
    const compulsoryCount = 2;
    const isValid = selectedSubjects.length === compulsoryCount + 2;
    setStepValid(isValid);
  }, [selectedSubjects]);

  useEffect(() => {
    // Reset selected subjects when class level changes
    if (category !== getCategoryFromClass(formData.classLevel)) {
      setSelectedSubjects([]);
    }
  }, [formData.classLevel]);

  const getCompulsorySubjects = () => {
    if (!category) return [];
    return ["Mathematics", "English Language"];
  };

  const compulsorySubjects = getCompulsorySubjects();
  const availableElectives = subjectsByCategory[category] || [];

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      if (compulsorySubjects.includes(subject)) return; // cannot remove compulsory
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      if (selectedSubjects.length < 4) {
        setSelectedSubjects([...selectedSubjects, subject]);
      }
    }
  };

  useEffect(() => {
    // Initialize compulsory subjects when category is available
    if (category && selectedSubjects.length === 0) {
      setSelectedSubjects(getCompulsorySubjects());
    }
  }, [category]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
        Step 3: Subject Selection
      </h2>

      {!category ? (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
          <p className="text-yellow-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Please select your class level in Step 2 to choose subjects
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Select 4 Subjects for the Quiz
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Mathematics and English Language are compulsory</span>{" "}
              for all participants. Select 2 additional subjects from the options below.
            </p>

            <div className="mt-4 flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(selectedSubjects.length / 4) * 100}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {selectedSubjects.length} of 4 selected
              </span>
            </div>
          </div>

          {/* Compulsory Subjects */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Compulsory Subjects (Selected for all candidates)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compulsorySubjects.map((subject) => (
                <div
                  key={subject}
                  className="p-4 border rounded-lg bg-green-50 border-green-300 cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3 border-green-500 bg-green-500">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="font-medium text-green-700">{subject}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Elective Subjects */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Select 2 Additional Subjects</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableElectives.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                const isDisabled = selectedSubjects.length >= 4 && !isSelected;

                return (
                  <div
                    key={subject}
                    onClick={() => !isDisabled && toggleSubject(subject)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className={isSelected ? "font-medium text-blue-700" : "text-gray-700"}>
                        {subject}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedSubjects.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Selected Subjects:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subject) => (
                  <span
                    key={subject}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      compulsorySubjects.includes(subject)
                        ? "bg-green-100 text-green-800 cursor-not-allowed"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {subject}
                    {!compulsorySubjects.includes(subject) && (
                      <button
                        type="button"
                        onClick={() => toggleSubject(subject)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseSelection;
