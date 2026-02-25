import React, { useState } from 'react';
import HorizontalStudentBenefits from './HorizontalStudentBenefits';

interface Benefit {
  id: number;
  title: string;
  excerpt: string;
  fullContent: string;
  imageUrl: string;
  alignment: 'left' | 'right';
  category: string;
  date: string;
}

const StudentBenefits: React.FC = () => {
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

  const benefits: Benefit[] = [
    {
      id: 1,
      title: "Exclusive Scholarship Opportunities",
      excerpt: "Our platform partners with top schools to offer exclusive scholarships to high-performing students.",
      fullContent: "We've established partnerships with over 150 schools worldwide to provide exclusive scholarship opportunities for our participants. These scholarships range from partial tuition coverage to full-ride opportunities for exceptional students. Our algorithm matches your profile with the most relevant scholarships, increasing your chances of securing financial aid for your education.",
      imageUrl: "https://www.nigeriaprivateschools.com/uploads/images/Grandmates_Schools.jpg",
      alignment: 'left',
      category: "Financial Benefits",
      date: "May 15, 2023"
    },
    {
      id: 2,
      title: "Personalized Learning Paths",
      excerpt: "AI-driven learning paths adapt to your strengths and weaknesses for optimal academic growth.",
      fullContent: "Our advanced AI system analyzes your performance across subjects and creates personalized learning paths tailored to your specific needs. The algorithm identifies knowledge gaps, suggests targeted exercises, and adapts in real-time as you progress. This personalized approach has been shown to improve learning outcomes by up to 72% compared to traditional one-size-fits-all methods.",
      imageUrl: "https://nigeria-britain.org/wp-content/uploads/2025/09/30-1.jpg",
      alignment: 'right',
      category: "Academic Support",
      date: "June 2, 2023"
    },
    {
      id: 3,
      title: "Career Mentorship Program",
      excerpt: "Connect with industry professionals who provide guidance and career advice tailored to your goals.",
      fullContent: "Our mentorship program pairs students with experienced professionals in their field of interest. Through regular virtual meetings, mentors provide guidance on career choices, educational paths, and professional development. Many of our mentors are executives at Fortune 500 companies or leaders in their respective fields, offering invaluable insights and networking opportunities that can jumpstart your career.",
      imageUrl: "https://thenhef.org/wp-content/uploads/2022/11/DEMI1036.jpg",
      alignment: 'left',
      category: "Career Development",
      date: "June 18, 2023"
    },
    {
      id: 4,
      title: "Global Student Community",
      excerpt: "Join a diverse network of students from around the world to collaborate and share knowledge.",
      fullContent: "When you join our platform, you become part of a global community of over 500,000 students from 150 countries. This diverse network allows for cultural exchange, collaborative learning, and international friendship. Our community features include study groups, topic-based forums, and virtual events with guest speakers from top schools worldwide.",
      imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alignment: 'right',
      category: "Networking",
      date: "July 5, 2023"
    }
  ];

  const openModal = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedBenefit(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <div className="bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Student <span className="text-blue-600">Benefits</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the exclusive advantages and opportunities available to our student participants
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-20">
          {benefits.map((benefit) => (
            <div 
              key={benefit.id} 
              className={`flex flex-col ${benefit.alignment === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
            >
              {/* Image */}
              <div className="lg:w-1/2 w-full">
                <div 
                  className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105"
                  onClick={() => openModal(benefit)}
                >
                  <img 
                    src={benefit.imageUrl} 
                    alt={benefit.title} 
                    className="w-full h-72 object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 w-full">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {benefit.category}
                    </span>
                    <span className="text-sm text-gray-500">{benefit.date}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-6">
                    {benefit.excerpt}
                  </p>
                  
                  <button
                    onClick={() => openModal(benefit)}
                    className="text-blue-600 font-semibold flex items-center hover:text-blue-800 transition-colors"
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedBenefit && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 mt-24">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedBenefit.imageUrl} 
                alt={selectedBenefit.title} 
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {selectedBenefit.category}
                </span>
                <span className="text-sm text-gray-500">{selectedBenefit.date}</span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedBenefit.title}
              </h3>
              
              <div className="text-gray-700 space-y-4">
                {selectedBenefit.fullContent.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HorizontalStudentBenefits/>
    </div>
  );
};

export default StudentBenefits;