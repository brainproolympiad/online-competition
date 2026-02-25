import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const Rules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'faq'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch FAQ data from Supabase
  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from<FAQItem>('faqs')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error.message);
      } else {
        setFaqData(data || []);
      }
      setLoading(false);
    };

    fetchFAQs();
  }, []);

  // ✅ Filter FAQ search
  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FAQsToShow = showAll || searchQuery
    ? filteredFAQs
    : filteredFAQs.slice(0, 10);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Competition <span className="text-blue-600">Rules & FAQ</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rules'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Competition Rules
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Frequently Asked Questions
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* ✅ Rules Section */}
          {activeTab === 'rules' && (
            <div className="text-gray-800 space-y-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-800">
                Competition Guidelines
              </h3>

              <ol className="list-decimal pl-6 space-y-3 text-lg">
                <li>All participants must be duly registered and verified before the competition.</li>
                <li>Each round will be conducted under strict supervision using the official platform.</li>
                <li>Participants are expected to maintain academic integrity — cheating leads to disqualification.</li>
                <li>Use of unauthorized materials, gadgets, or communication during tests is strictly prohibited.</li>
                <li>Ensure a stable internet connection before starting the test; interruptions are not excused.</li>
                <li>Scoring is automated and based on accuracy and completion time.</li>
                <li>Winners will be determined by total scores and may undergo verification.</li>
                <li>Respect other participants and maintain decorum in all related communication channels.</li>
                <li>The decision of the organizers is final in all matters concerning the competition.</li>
                <li>Certificates and prizes will be awarded to outstanding candidates across categories.</li>
              </ol>
            </div>
          )}

          {/* ✅ FAQ Section */}
          {activeTab === 'faq' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Frequently Asked Questions
              </h3>

              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search for questions or answers..."
                  className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-600">Loading FAQs...</div>
              ) : (
                <div className="space-y-4">
                  {FAQsToShow.length > 0 ? (
                    FAQsToShow.map((faq) => (
                      <div
                        key={faq.id}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <button
                          className="flex justify-between items-center w-full text-left font-medium text-blue-800 hover:text-blue-600 focus:outline-none"
                          onClick={() =>
                            setExpandedId(expandedId === faq.id ? null : faq.id)
                          }
                        >
                          <span>{faq.question}</span>
                          <svg
                            className={`h-5 w-5 transform transition-transform ${
                              expandedId === faq.id ? 'rotate-180' : ''
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {expandedId === faq.id && (
                          <div className="mt-2 text-gray-700 pl-2">
                            <p>{faq.answer}</p>
                            <div className="mt-2">
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                {faq.category}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      No FAQs found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rules;
