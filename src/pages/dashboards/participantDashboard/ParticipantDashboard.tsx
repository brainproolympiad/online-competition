// src/pages/dashboards/ParticipantDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

interface QuizAttempt {
  id: string;
  quiz_id: string;
  participant_id: string;
  started_at: string;
  completed_at: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  passed: boolean;
  status: 'in_progress' | 'completed' | 'abandoned';
  duration_seconds?: number;
  warnings?: number;
  violations?: string[];
  user_answers?: Record<number, string>;
  created_at: string;
  updated_at: string;
  quizzes: {
    title: string;
    subject: string;
    description: string;
    duration_minutes: number;
    passing_score: number;
  };
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  classLevel: string;
  courses: string[] | string;
  paid: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  created_at: string;
  type: 'document' | 'video' | 'quiz' | 'assignment';
}

interface QuizInfo {
  id: string;
  title: string;
  subject: string;
  instructions: string;
  link: string;
  duration: number;
  total_questions: number;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'active' | 'completed';
  target_classes?: string[];
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_at: string;
  priority: 'low' | 'medium' | 'high';
}

interface SubjectScore {
  subject: string;
  score: number;
  displayName: string;
  attempts: number;
  averageScore: number;
  bestScore: number;
}

const ParticipantDashboard: React.FC = () => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState<QuizInfo[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sample data for fallback
  const sampleResources: Resource[] = [
    {
      id: '1',
      title: 'Mathematics Study Guide',
      description: 'Comprehensive guide for basic mathematics concepts',
      link: '/resources/math-guide',
      type: 'document',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'English Grammar Video',
      description: 'Video lessons on English grammar rules',
      link: '/resources/english-video',
      type: 'video',
      created_at: new Date().toISOString()
    }
  ];

  const sampleQuizzes: QuizInfo[] = [
    {
      id: '1',
      title: 'Mathematics Assessment',
      subject: 'Mathematics',
      instructions: 'This quiz covers basic arithmetic operations. You have 60 minutes to complete it.',
      link: '/quiz/1',
      duration: 60,
      total_questions: 20,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      target_classes: ['JSS 1', 'JSS 2', 'JSS 3']
    }
  ];

  const sampleAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Welcome to the Platform',
      message: 'We are excited to have you here. Make sure to check out all available resources.',
      created_at: new Date().toISOString(),
      priority: 'high'
    }
  ];

  // Fetch participant data
  const fetchParticipant = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching participant:", error);
      return null;
    }
  };

  // Fetch quiz attempts
  const fetchQuizAttempts = async (participantId: string) => {
    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          *,
          quizzes (
            title,
            subject,
            description,
            duration_minutes,
            passing_score
          )
        `)
        .eq("participant_id", participantId)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      return [];
    }
  };

  // Fetch resources
  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || sampleResources;
    } catch (error) {
      console.error("Error fetching resources:", error);
      return sampleResources;
    }
  };

  // Fetch quizzes
  const fetchQuizzes = async (participantClass: string) => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        const transformedExams: QuizInfo[] = data.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          subject: quiz.subject,
          instructions: quiz.description || `This exam is for ${quiz.class_level} students.`,
          link: `/quiz/${quiz.id}`,
          duration: quiz.duration_minutes || 60,
          total_questions: quiz.total_questions,
          start_time: quiz.start_time || new Date().toISOString(),
          end_time: quiz.end_time || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          target_classes: quiz.target_classes || [quiz.class_level],
          status: getQuizStatus(quiz)
        }));

        return filterQuizzesByClass(transformedExams, participantClass);
      }
      return sampleQuizzes;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return filterQuizzesByClass(sampleQuizzes, participantClass);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || sampleAnnouncements;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return sampleAnnouncements;
    }
  };

  // Utility functions
  const normalizeClassLevel = (classLevel: string | null | undefined): string => {
    if (!classLevel) return '';
    return classLevel
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/^JSS\s*(\d)$/, 'JSS $1')
      .replace(/^SS\s*(\d)$/, 'SS $1');
  };

  const filterQuizzesByClass = (quizzes: QuizInfo[], participantClass: string | null | undefined): QuizInfo[] => {
    if (!participantClass) return quizzes;
    const normalizedParticipantClass = normalizeClassLevel(participantClass);
    
    return quizzes.filter(quiz => {
      const quizClasses = quiz.target_classes || [];
      if (quizClasses.length === 0) return true;
      
      return quizClasses.some(quizClass => 
        normalizeClassLevel(quizClass) === normalizedParticipantClass
      );
    });
  };

 //  update the getQuizStatus function:
const getQuizStatus = (quiz: any): 'upcoming' | 'active' | 'completed' => {
  const now = new Date();
  const start = new Date(quiz.start_time || now);
  const end = new Date(quiz.end_time || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
  
  // If quiz is inactive, show as upcoming
  if (quiz.is_active === false) {
    return 'upcoming';
  }
  
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
};

  const formatCourses = (courses: string[] | string): string[] => {
    if (!courses) return [];
    if (typeof courses === "string") {
      try {
        const parsed = JSON.parse(courses);
        return Array.isArray(parsed) ? parsed : [courses];
      } catch {
        return courses.split(",").map((c) => c.trim());
      }
    }
    return courses;
  };

  const formatTimeSpent = (seconds: number | undefined): string => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatSubjectName = (subject: string): string => {
    const subjectMappings: { [key: string]: string } = {
      'mathematics': 'Mathematics',
      'math': 'Mathematics',
      'english': 'English Language',
      'english_language': 'English Language',
      'physics': 'Physics',
      'chemistry': 'Chemistry',
      'biology': 'Biology',
      'further_math': 'Further Mathematics',
      'literature': 'Literature',
      'government': 'Government',
      'economics': 'Economics',
    };

    return subjectMappings[subject.toLowerCase()] || 
      subject.split(/[_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  };

  const getScoreRemark = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    if (score >= 50) return "Pass";
    return "Needs Improvement";
  };

  // Calculate subject scores
  const getSubjectScoresFromAttempts = (): SubjectScore[] => {
    const subjectMap: { [key: string]: { scores: number[], attempts: number } } = {};

    quizAttempts.forEach(attempt => {
      if (attempt.status === 'completed' && attempt.quizzes?.subject) {
        const subject = attempt.quizzes.subject;
        const percentage = attempt.percentage || 
          (attempt.total_questions > 0 ? 
            Math.round((attempt.correct_answers / attempt.total_questions) * 100) : 0);

        if (!subjectMap[subject]) {
          subjectMap[subject] = { scores: [], attempts: 0 };
        }
        subjectMap[subject].scores.push(percentage);
        subjectMap[subject].attempts++;
      }
    });

    return Object.entries(subjectMap).map(([subject, data]) => {
      const averageScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
      const bestScore = Math.max(...data.scores);

      return {
        subject,
        score: averageScore,
        displayName: formatSubjectName(subject),
        attempts: data.attempts,
        averageScore,
        bestScore
      };
    }).sort((a, b) => b.score - a.score);
  };

  // Calculate overall statistics
  const calculateOverallStats = () => {
    const completedAttempts = quizAttempts.filter(attempt => 
      attempt.status === 'completed'
    );
    
    const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    const totalPossible = completedAttempts.reduce((sum, attempt) => sum + (attempt.total_questions || 0), 0);
    const overallPercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    const completedExams = completedAttempts.length;
    
    const totalTimeSpent = completedAttempts.reduce((sum, attempt) => 
      sum + (attempt.duration_seconds || 0), 0
    );

    return {
      totalScore,
      totalPossible,
      overallPercentage,
      completedExams,
      totalTimeSpent
    };
  };

  // Refresh scores
  const refreshScores = async () => {
    if (participant) {
      const attempts = await fetchQuizAttempts(participant.id);
      setQuizAttempts(attempts);
      
      const completedCount = attempts.filter(a => a.status === 'completed').length;
      
      if (completedCount > 0) {
        Swal.fire('Success', `Scores updated! Found ${completedCount} completed quizzes.`, 'success');
      } else {
        Swal.fire('Info', 'No completed quizzes found.', 'info');
      }
    }
  };

  // Main data loading effect
  useEffect(() => {
    const loadDashboardData = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) {
        setAuthError("Please log in to access the dashboard");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(stored);
        const participantData = await fetchParticipant(user.email);
        
        if (!participantData) {
          setAuthError("No participant account found. Please register first.");
          setLoading(false);
          return;
        }

        setParticipant(participantData);

        // Load all data in parallel
        const [attempts, resourcesData, quizzesData, announcementsData] = await Promise.all([
          fetchQuizAttempts(participantData.id),
          fetchResources(),
          fetchQuizzes(participantData.classLevel),
          fetchAnnouncements()
        ]);

        setQuizAttempts(attempts);
        setResources(resourcesData);
        setQuizzes(quizzesData);
        setAnnouncements(announcementsData);
        
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setAuthError("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Event handlers
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleLoginRedirect = () => {
    navigate('/signin');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Your Dashboard...</h2>
        </div>
      </div>
    );
  }

  // Auth error state
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">{authError}</p>
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Login
            </button>
            <button
              onClick={handleRegisterRedirect}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Go to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  const courseArray = formatCourses(participant?.courses || []);
  const participantClass = participant?.classLevel;
  const subjectScores = getSubjectScoresFromAttempts();
  const stats = calculateOverallStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <div className="text-sm text-gray-500">
                Welcome, {participant?.fullName}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Student Info Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full"
                src={`https://ui-avatars.com/api/?name=${participant?.fullName}&background=random&size=128&bold=true`}
                alt="Avatar"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {participant?.fullName}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {participant?.email}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🏫 {participantClass}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    📚 {courseArray.length} Courses
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    participant?.paid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    💳 {participant?.paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>
              <button
                onClick={refreshScores}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Refresh Scores
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['overview', 'quizzes', 'resources', 'scores', 'announcements'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Quick Stats */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Exams
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {stats.completedExams}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Overall Score
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {stats.overallPercentage}%
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Upcoming Quizzes */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Upcoming Quizzes
                </h3>
                <div className="space-y-3">
                  {quizzes.filter(q => q.status === 'upcoming').slice(0, 3).map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{quiz.title}</h4>
                        <p className="text-sm text-gray-500">{quiz.subject}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(quiz.start_time).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {quizzes.filter(q => q.status === 'upcoming').length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No upcoming quizzes</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Announcements
                </h3>
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                      <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No announcements</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Available Quizzes
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-gray-900">{quiz.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quiz.status === 'active' ? 'bg-green-100 text-green-800' :
                        quiz.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quiz.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{quiz.subject}</p>
                    <p className="text-xs text-gray-500 mb-3">{quiz.instructions}</p>
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span>Duration: {quiz.duration}m</span>
                      <span>Questions: {quiz.total_questions}</span>
                    </div>
                    {quiz.status === 'active' && (
                      <button
                        onClick={() => navigate(quiz.link)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                ))}
                {quizzes.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No quizzes available for your class.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Learning Resources
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">
                        {resource.type === 'video' ? '🎬' :
                         resource.type === 'quiz' ? '📝' :
                         resource.type === 'assignment' ? '📋' : '📄'}
                      </span>
                      <h4 className="text-md font-medium text-gray-900">{resource.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      Open Resource
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scores' && (
          <div className="space-y-6">
            {/* Overall Performance */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Overall Performance
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Exams</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.completedExams}</dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.overallPercentage}%</dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Time</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {Math.round(stats.totalTimeSpent / 60)}m
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz History */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quiz History
                </h3>
                {quizAttempts.filter(attempt => attempt.status === 'completed').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No completed quizzes yet.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quiz
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {quizAttempts
                          .filter(attempt => attempt.status === 'completed')
                          .slice(0, 10)
                          .map((attempt) => {
                            const percentage = attempt.percentage || 
                              (attempt.total_questions > 0 ? 
                                Math.round((attempt.correct_answers / attempt.total_questions) * 100) : 0);
                            const passed = percentage >= (attempt.quizzes?.passing_score || 50);

                            return (
                              <tr key={attempt.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {attempt.quizzes?.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatSubjectName(attempt.quizzes?.subject)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {percentage}% ({attempt.correct_answers}/{attempt.total_questions})
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {passed ? 'Passed' : 'Failed'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(attempt.completed_at).toLocaleDateString()}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Subject Performance */}
            {subjectScores.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Subject Performance
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {subjectScores.map((subjectScore) => (
                      <div key={subjectScore.subject} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-900 mb-2">
                          {subjectScore.displayName}
                        </h4>
                        <div className="flex items-baseline mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {subjectScore.score}%
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            Average
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Best: {subjectScore.bestScore}%</div>
                          <div>Attempts: {subjectScore.attempts}</div>
                          <div>Grade: {getScoreRemark(subjectScore.score)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                All Announcements
              </h3>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-gray-900">{announcement.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                        announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No announcements available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDashboard;