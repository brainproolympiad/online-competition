import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // make sure supabaseClient is configured

const CompetitionSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [registrationDeadline, setRegistrationDeadline] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const handleRegisterNavigation = () => navigate('/Register');

  // Fetch registration deadline from database
  useEffect(() => {
    const fetchDeadline = async () => {
      const { data, error } = await supabase
        .from('competition_settings')
        .select('registration_deadline')
        .limit(1)
        .single(); // assuming only one row

      if (error) {
        console.error('Error fetching registration deadline:', error);
      } else if (data) {
        const date = new Date(data.registration_deadline);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        setRegistrationDeadline(formattedDate);
      }
    };

    fetchDeadline();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Annual <span className="text-blue-600">Brain Pro Olympiad</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join the most prestigious brain pro olympiad competition for secondary schools nationwide
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Text Content */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Showcase Your Knowledge & Win Amazing Prizes
              </h3>

              <p className="text-gray-700 mb-4">
                Our annual brain pro olympiad competition brings together the brightest minds from secondary schools across the country. 
                This is your chance to demonstrate your knowledge, critical thinking skills, and academic prowess.
              </p>

              <div className={isExpanded ? 'block' : 'hidden'}>
                <p className="text-gray-700 mb-4">
                  The competition features multiple rounds covering various subjects including Mathematics, English Language, Sciences, Literature, 
                  History, and Current Affairs. Each round is designed to challenge participants and encourage deep thinking.
                </p>

                <p className="text-gray-700 mb-4">
                  Participants will have the opportunity to compete individually, fostering both independent thinking and problem-solving skills. The final round will be held at the National Convention Center with live audience and broadcasting.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Competition Highlights:</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Over N500,000 in scholarships and prizes</li>
                  <li>Recognition from top schools and educational institutions</li>
                  <li>Media coverage in national educational publications</li>
                  <li>Networking opportunities with academic leaders and peers</li>
                  <li>Exclusive educational trips for top performers</li>
                </ul>
              </div>

              <button
                onClick={toggleReadMore}
                className="mt-6 flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <span>Read Less</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">250+</div>
                <div className="text-sm text-gray-600">Schools Participating</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">N500,000</div>
                <div className="text-sm text-gray-600">In Prizes</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">12+</div>
                <div className="text-sm text-gray-600">Subjects Covered </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Competition Rounds</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1634951401794-6c84f593db82?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Students participating in brain pro olympiad competition" 
                className="rounded-xl shadow-xl w-full h-auto"
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg">
                <div className="text-sm font-semibold">Registration Deadline</div>
                <div className="text-xl font-bold">
                  {registrationDeadline || 'Loading...'}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 text-center">
              <button onClick={handleRegisterNavigation} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Register Now
              </button>
              <p className="text-gray-600 text-sm mt-4">
                Limited spots available. Early registration recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionSection;
