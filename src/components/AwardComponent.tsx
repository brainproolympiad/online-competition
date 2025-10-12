import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AwardsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculation' | 'prizes' | 'rules'>('prizes');

  const navigate = useNavigate();
    const handleRegisterNavigation = ()=>{
      navigate("/Register")
    }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-100 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Competition <span className="text-blue-600">Awards & Prizes</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Amazing prizes await the top performers in our Brain Pro Olympiad
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab('prizes')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'prizes' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Prize Breakdown
            </button>
            <button
              onClick={() => setActiveTab('calculation')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'calculation' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Scoring System
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'rules' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Rules & Eligibility
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {activeTab === 'prizes' && (
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Prize Distribution</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                
                {/* 2nd Place */}
                <div className="text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="relative mb-6">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc-y6LF4LXxRqDD-tsStPsYBKJacM4pOoyYg&s" 
                      alt="Second Place Silver Medal" 
                      className="w-40 h-40 object-contain mx-auto"
                    />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                      2nd
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Second Place</h4>
                  {/* <div className="text-2xl font-bold text-gray-600 mb-2">N150,000</div> */}
                  <p className="text-gray-600">Trophy and silver medal</p>
                </div>

                {/* 1st Place */}
                <div className="text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="relative mb-6">
                    <img 
                      src="https://img.freepik.com/premium-vector/gold-medal-with-red-ribbon-that-says-1_1294168-10264.jpg?w=360" 
                      alt="First Place Gold Medal" 
                      className="w-40 h-40 object-contain mx-auto"
                    />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                      1st
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">First Place</h4>
                  <div className="text-2xl font-bold text-yellow-600 mb-2">N150,000</div>
                  <p className="text-gray-600">Plus trophy and gold medal</p>
                </div>


                {/* 3rd Place */}
                <div className="text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="relative mb-6">
                    <img 
                      src="https://www.allquality.com/cdn/shop/products/3rd_Place_High_Relief.png?v=1585156475" 
                      alt="Third Place Bronze Medal" 
                      className="w-40 h-40 object-contain mx-auto"
                    />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                      3rd
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Third Place</h4>
                  {/* <div className="text-2xl font-bold text-amber-700 mb-2">N50,000</div> */}
                  <p className="text-gray-600">Trophy and bronze medal</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Additional Prizes</h4>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span>4th-10th Place: Special Certificate of Honour</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span>Special Category Awards: Special Certificate of Participation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span>All participants: Certificate of Achievement</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span>School trophies for top-performing institutions</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'calculation' && (
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Scoring System & Calculations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Score Calculation Formula</h4>
                  <div className="bg-gray-50 p-5 rounded-lg mb-5">
                    <div className="text-center font-mono text-sm mb-2">
                      Total Score = (Correct Answers × 1) - (Incorrect Answers × 0) + (Time Bonus)
                    </div>
                    <div className="text-xs text-gray-500 text-center">*Unanswered questions: 0 points</div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Time Bonus Calculation</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Questions answered in under 10 seconds: <strong>+0.2 points</strong></span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Questions answered in 10 - 20 seconds: <strong>+0.05 point</strong></span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Questions answered over 60 seconds: <strong>+0 points</strong></span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Example Calculation</h4>
                  <div className="bg-blue-50 p-5 rounded-lg mb-5">
                    <div className="flex justify-between mb-2">
                      <span>Correct Answers: 18 × 1 =</span>
                      <span className="font-semibold">18 points</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Incorrect Answers: 4 × 0 =</span>
                      <span className="font-semibold">0 points</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Time Bonus (10 questions):</span>
                      <span className="font-semibold">2 points</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 flex justify-between font-bold">
                      <span>Total Score:</span>
                      <span>20 points</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Tie-Breaking Procedure</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Highest number of correct answers</li>
                    <li>Highest time bonus earned</li>
                    <li>Shortest total time taken</li>
                    <li>Score in final round questions</li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> All scores are calculated automatically by our system. Participants can view their detailed score after each subject quiz. Each score will be saved on your dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Competition Rules & Eligibility</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Eligibility Criteria</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Open to all secondary school students aged 10-22</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Participants must be currently enrolled in an accredited educational institution</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>No prior competition experience required</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Participants must register through their school or with parental consent</span>
                    </li>
                  </ul>
                  
                  <h4 className="text-lg font-semibold text-blue-800 mt-6 mb-3">Competition Structure</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Preliminary Round 1: Mathematics </span>
                    </li>

                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Preliminary Round 2: English Language</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Semi-Finals Round 3: Choice Subject 1</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>National Finals Round 4: Choice Subject 2 </span>
                    </li>
                  </ul>
                  
                </div>

                 
                
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">General Rules</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>All participants must complete the test independently without assistance</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Use of external resources or devices during the test is prohibited</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Decisions by the judges and scoring system are final</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span>Cash prizes will be distributed through educational scholarships or direct payment to winners</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          <strong>Registration is N5,000</strong> for all participants. No hidden fees or charges.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r mt-10 justify-center">
                <div className="flex justify-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> All rounds contains live event with invigilators and live feed to ensure full monitoring against cheating during each round. Also, participants will be automatically disqualified if the system detects any violation to exam conduct, no body movement and no side distraction will be allowed.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          )}
          
        </div>

        

        {/* CTA */}
        <div className="text-center mt-10">
          <button onClick={handleRegisterNavigation} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            Register for the Competition
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default AwardsComponent;