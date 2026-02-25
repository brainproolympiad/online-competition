import React from "react";

interface Props {
  formData: any;
}

const Confirmation: React.FC<Props> = ({ formData }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
        <p className="text-gray-600">
          Thank you for registering. Please review your details carefully before final submission.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Personal Info Card */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-blue-800">Personal Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">{formData.fullName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{formData.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{formData.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{formData.address || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">State</p>
              <p className="font-medium">{formData.state || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">LGA</p>
              <p className="font-medium">{formData.lga || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Education Info Card */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-purple-800">Education Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">School Name</p>
              <p className="font-medium">{formData.schoolName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Class</p>
              <p className="font-medium">{formData.currentClass || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Previous Result</p>
              <p className="font-medium">{formData.previousResult || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Course Selection Card */}
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
          <div className="flex items-center mb-4">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-amber-800">Course Selection</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Selected Subject</p>
              <p className="font-medium">{formData.course || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Account & Payment Card */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-green-800">Account & Payment</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium">{formData.username || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              {formData.paid ? (
                <div className="flex items-center text-green-700">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="font-medium">Payment Successful</span>
                </div>
              ) : (
                <div className="flex items-center text-red-700">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span className="font-medium">Payment not completed</span>
                </div>
              )}
            </div>
            {formData.paid && formData.paymentRef && (
              <div>
                <p className="text-sm text-gray-600">Reference Number</p>
                <p className="font-medium">{formData.paymentRef}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">What happens next?</h3>
            <p className="text-gray-600">
              You will receive a confirmation email shortly. The quiz competition details will be sent to you one week before the event.
            </p>
          </div>
        </div>
      </div>
      

      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors" onClick={window.print}>
          Download Registration Summary
        </button>
        <p className="text-sm text-gray-600 mt-4">
          Need to make changes? Contact support at support@brainpro.ng
        </p>
      </div>
    </div>
  );
};

export default Confirmation;