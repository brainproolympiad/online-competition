import React, { useEffect } from "react";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setStepValid: (isValid: boolean) => void; // 👈 Add this
}

const EducationInfo: React.FC<Props> = ({ formData, setFormData, setStepValid }) => {
  useEffect(() => {
    const requiredFields = [
      formData.schoolName,
      formData.schoolAddress,
      formData.classLevel,
      formData.term,
      formData.favoriteSubject,
      formData.schoolType,
    ];

    const isValid = requiredFields.every((field) => field && field.trim() !== "");
    setStepValid(isValid); // ✅ Update parent about validation status
  }, [
    formData.schoolName,
    formData.schoolAddress,
    formData.classLevel,
    formData.term,
    formData.favoriteSubject,
    formData.schoolType,
    setStepValid,
  ]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
        Step 2: Education Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School Name */}
        <div className="md:col-span-2">
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">School Name</span>
            <input
              type="text"
              placeholder="Enter your school name"
              value={formData.schoolName || ""}
              onChange={(e) =>
                setFormData({ ...formData, schoolName: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </label>
        </div>

        {/* School Address */}
        <div className="md:col-span-2">
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">School Address</span>
            <input
              type="text"
              placeholder="Enter your school address"
              value={formData.schoolAddress || ""}
              onChange={(e) =>
                setFormData({ ...formData, schoolAddress: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </label>
        </div>

        {/* Class Level */}
        <div>
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">Class</span>
            <select
              value={formData.classLevel || ""}
              onChange={(e) =>
                setFormData({ ...formData, classLevel: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select your class</option>
              <optgroup label="Junior Secondary">
                <option value="JSS1">JSS 1</option>
                <option value="JSS2">JSS 2</option>
                <option value="JSS3">JSS 3</option>
              </optgroup>
              <optgroup label="Senior Secondary">
                <option value="SS1">SS 1</option>
                <option value="SS2">SS 2</option>
                <option value="SS3">SS 3</option>
              </optgroup>
            </select>
          </label>
        </div>

        {/* Current Term */}
        <div>
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">Current Term</span>
            <select
              value={formData.term || ""}
              onChange={(e) =>
                setFormData({ ...formData, term: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select term</option>
              <option value="1st Term">1st Term</option>
              <option value="2nd Term">2nd Term</option>
              <option value="3rd Term">3rd Term</option>
            </select>
          </label>
        </div>

        {/* Favorite Subject */}
        <div>
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">Favorite Subject</span>
            <select
              value={formData.favoriteSubject || ""}
              onChange={(e) =>
                setFormData({ ...formData, favoriteSubject: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Vocational Studies">Vocational Studies</option>
              <option value="Arts">Arts</option>
            </select>
          </label>
        </div>

        {/* School Type */}
        <div>
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">School Type</span>
            <select
              value={formData.schoolType || ""}
              onChange={(e) =>
                setFormData({ ...formData, schoolType: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select school type</option>
              <option value="Public">Public School</option>
              <option value="Private">Private School</option>
              <option value="Federal">Federal Government College</option>
              <option value="State">State Model College</option>
            </select>
          </label>
        </div>

        {/* Previous Quiz Experience */}
        <div className="md:col-span-2">
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">
              Previous Quiz Experience (if any)
            </span>
            <textarea
              placeholder="List any quiz competitions you've participated in before"
              value={formData.quizExperience || ""}
              onChange={(e) =>
                setFormData({ ...formData, quizExperience: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
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
          Important Note
        </h3>
        <p className="text-sm text-blue-600">
          Please ensure all information provided is accurate. Your school may be contacted for verification purposes.
        </p>
      </div>
    </div>
  );
};

export default EducationInfo;
