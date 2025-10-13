import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboards/ParticipantDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
const ParticipantDashboard = () => {
    const [participant, setParticipant] = useState(null);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [resources, setResources] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [authError, setAuthError] = useState(null);
    const navigate = useNavigate();
    // Sample data for fallback
    const sampleResources = [
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
    const sampleQuizzes = [
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
    const sampleAnnouncements = [
        {
            id: '1',
            title: 'Welcome to the Platform',
            message: 'We are excited to have you here. Make sure to check out all available resources.',
            created_at: new Date().toISOString(),
            priority: 'high'
        }
    ];
    // Fetch participant data
    const fetchParticipant = async (email) => {
        try {
            const { data, error } = await supabase
                .from("registrations")
                .select("*")
                .eq("email", email)
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error("Error fetching participant:", error);
            return null;
        }
    };
    // Fetch quiz attempts
    const fetchQuizAttempts = async (participantId) => {
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
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
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
            if (error)
                throw error;
            return data || sampleResources;
        }
        catch (error) {
            console.error("Error fetching resources:", error);
            return sampleResources;
        }
    };
    // Fetch quizzes
    const fetchQuizzes = async (participantClass) => {
        try {
            const { data, error } = await supabase
                .from("quizzes")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });
            if (error)
                throw error;
            if (data) {
                const transformedExams = data.map(quiz => ({
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
        }
        catch (error) {
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
            if (error)
                throw error;
            return data || sampleAnnouncements;
        }
        catch (error) {
            console.error("Error fetching announcements:", error);
            return sampleAnnouncements;
        }
    };
    // Utility functions
    const normalizeClassLevel = (classLevel) => {
        if (!classLevel)
            return '';
        return classLevel
            .trim()
            .toUpperCase()
            .replace(/\s+/g, ' ')
            .replace(/^JSS\s*(\d)$/, 'JSS $1')
            .replace(/^SS\s*(\d)$/, 'SS $1');
    };
    const filterQuizzesByClass = (quizzes, participantClass) => {
        if (!participantClass)
            return quizzes;
        const normalizedParticipantClass = normalizeClassLevel(participantClass);
        return quizzes.filter(quiz => {
            const quizClasses = quiz.target_classes || [];
            if (quizClasses.length === 0)
                return true;
            return quizClasses.some(quizClass => normalizeClassLevel(quizClass) === normalizedParticipantClass);
        });
    };
    //  update the getQuizStatus function:
    const getQuizStatus = (quiz) => {
        const now = new Date();
        const start = new Date(quiz.start_time || now);
        const end = new Date(quiz.end_time || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
        // If quiz is inactive, show as upcoming
        if (quiz.is_active === false) {
            return 'upcoming';
        }
        if (now < start)
            return 'upcoming';
        if (now > end)
            return 'completed';
        return 'active';
    };
    const formatCourses = (courses) => {
        if (!courses)
            return [];
        if (typeof courses === "string") {
            try {
                const parsed = JSON.parse(courses);
                return Array.isArray(parsed) ? parsed : [courses];
            }
            catch {
                return courses.split(",").map((c) => c.trim());
            }
        }
        return courses;
    };
    const formatTimeSpent = (seconds) => {
        if (!seconds)
            return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };
    const formatSubjectName = (subject) => {
        const subjectMappings = {
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
    const getScoreRemark = (score) => {
        if (score >= 90)
            return "Excellent";
        if (score >= 80)
            return "Very Good";
        if (score >= 70)
            return "Good";
        if (score >= 60)
            return "Average";
        if (score >= 50)
            return "Pass";
        return "Needs Improvement";
    };
    // Calculate subject scores
    const getSubjectScoresFromAttempts = () => {
        const subjectMap = {};
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
        const completedAttempts = quizAttempts.filter(attempt => attempt.status === 'completed');
        const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
        const totalPossible = completedAttempts.reduce((sum, attempt) => sum + (attempt.total_questions || 0), 0);
        const overallPercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
        const completedExams = completedAttempts.length;
        const totalTimeSpent = completedAttempts.reduce((sum, attempt) => sum + (attempt.duration_seconds || 0), 0);
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
            }
            else {
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
            }
            catch (error) {
                console.error("Error loading dashboard:", error);
                setAuthError("Error loading dashboard data");
            }
            finally {
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
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700", children: "Loading Your Dashboard..." })] }) }));
    }
    // Auth error state
    if (authError) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD10" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Authentication Required" }), _jsx("p", { className: "text-gray-600 mb-6", children: authError }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: handleLoginRedirect, className: "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Go to Login" }), _jsx("button", { onClick: handleRegisterRedirect, className: "w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium", children: "Go to Registration" })] })] }) }));
    }
    const courseArray = formatCourses(participant?.courses || []);
    const participantClass = participant?.classLevel;
    const subjectScores = getSubjectScoresFromAttempts();
    const stats = calculateOverallStats();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-4", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Student Dashboard" }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Welcome, ", participant?.fullName] })] }), _jsx("button", { onClick: handleLogout, className: "bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors", children: "Logout" })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: [_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg mb-6", children: _jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("img", { className: "h-16 w-16 rounded-full", src: `https://ui-avatars.com/api/?name=${participant?.fullName}&background=random&size=128&bold=true`, alt: "Avatar" }), _jsxs("div", { className: "ml-4 flex-1", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: participant?.fullName }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: participant?.email }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [_jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: ["\uD83C\uDFEB ", participantClass] }), _jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: ["\uD83D\uDCDA ", courseArray.length, " Courses"] }), _jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${participant?.paid
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}`, children: ["\uD83D\uDCB3 ", participant?.paid ? "Paid" : "Unpaid"] })] })] }), _jsx("button", { onClick: refreshScores, className: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors", children: "Refresh Scores" })] }) }) }), _jsx("div", { className: "bg-white shadow-sm rounded-lg mb-6", children: _jsx("div", { className: "border-b border-gray-200", children: _jsx("nav", { className: "-mb-px flex space-x-8 px-6", children: ['overview', 'quizzes', 'resources', 'scores', 'announcements'].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: tab.charAt(0).toUpperCase() + tab.slice(1) }, tab))) }) }) }), activeTab === 'overview' && (_jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Quick Stats" }), _jsxs("dl", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [_jsxs("div", { className: "px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Completed Exams" }), _jsx("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: stats.completedExams })] }), _jsxs("div", { className: "px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Overall Score" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [stats.overallPercentage, "%"] })] })] })] }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Upcoming Quizzes" }), _jsxs("div", { className: "space-y-3", children: [quizzes.filter(q => q.status === 'upcoming').slice(0, 3).map((quiz) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-md", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: quiz.title }), _jsx("p", { className: "text-sm text-gray-500", children: quiz.subject })] }), _jsx("span", { className: "text-sm text-gray-500", children: new Date(quiz.start_time).toLocaleDateString() })] }, quiz.id))), quizzes.filter(q => q.status === 'upcoming').length === 0 && (_jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "No upcoming quizzes" }))] })] }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg lg:col-span-2", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Recent Announcements" }), _jsxs("div", { className: "space-y-4", children: [announcements.slice(0, 3).map((announcement) => (_jsxs("div", { className: "border-l-4 border-blue-400 bg-blue-50 p-4 rounded", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: announcement.title }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: announcement.message }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: new Date(announcement.created_at).toLocaleDateString() })] }, announcement.id))), announcements.length === 0 && (_jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "No announcements" }))] })] }) })] })), activeTab === 'quizzes' && (_jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Available Quizzes" }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: [quizzes.map((quiz) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "text-md font-medium text-gray-900", children: quiz.title }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quiz.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                quiz.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'}`, children: quiz.status })] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: quiz.subject }), _jsx("p", { className: "text-xs text-gray-500 mb-3", children: quiz.instructions }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mb-3", children: [_jsxs("span", { children: ["Duration: ", quiz.duration, "m"] }), _jsxs("span", { children: ["Questions: ", quiz.total_questions] })] }), quiz.status === 'active' && (_jsx("button", { onClick: () => navigate(quiz.link), className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors", children: "Start Quiz" }))] }, quiz.id))), quizzes.length === 0 && (_jsx("div", { className: "col-span-full text-center py-8", children: _jsx("p", { className: "text-gray-500", children: "No quizzes available for your class." }) }))] })] }) })), activeTab === 'resources' && (_jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Learning Resources" }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: resources.map((resource) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("span", { className: "text-lg mr-2", children: resource.type === 'video' ? '🎬' :
                                                            resource.type === 'quiz' ? '📝' :
                                                                resource.type === 'assignment' ? '📋' : '📄' }), _jsx("h4", { className: "text-md font-medium text-gray-900", children: resource.title })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: resource.description }), _jsx("a", { href: resource.link, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors", children: "Open Resource" })] }, resource.id))) })] }) })), activeTab === 'scores' && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Overall Performance" }), _jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-3", children: [_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Completed Exams" }), _jsx("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: stats.completedExams })] }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Average Score" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [stats.overallPercentage, "%"] })] }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Time" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [Math.round(stats.totalTimeSpent / 60), "m"] })] }) })] })] }) }), _jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Quiz History" }), quizAttempts.filter(attempt => attempt.status === 'completed').length === 0 ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-gray-500", children: "No completed quizzes yet." }) })) : (_jsx("div", { className: "overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-300", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Quiz" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Subject" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Score" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: quizAttempts
                                                            .filter(attempt => attempt.status === 'completed')
                                                            .slice(0, 10)
                                                            .map((attempt) => {
                                                            const percentage = attempt.percentage ||
                                                                (attempt.total_questions > 0 ?
                                                                    Math.round((attempt.correct_answers / attempt.total_questions) * 100) : 0);
                                                            const passed = percentage >= (attempt.quizzes?.passing_score || 50);
                                                            return (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: attempt.quizzes?.title }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: formatSubjectName(attempt.quizzes?.subject) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: [percentage, "% (", attempt.correct_answers, "/", attempt.total_questions, ")"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: passed ? 'Passed' : 'Failed' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(attempt.completed_at).toLocaleDateString() })] }, attempt.id));
                                                        }) })] }) }))] }) }), subjectScores.length > 0 && (_jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Subject Performance" }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: subjectScores.map((subjectScore) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h4", { className: "text-md font-medium text-gray-900 mb-2", children: subjectScore.displayName }), _jsxs("div", { className: "flex items-baseline mb-2", children: [_jsxs("span", { className: "text-2xl font-bold text-gray-900", children: [subjectScore.score, "%"] }), _jsx("span", { className: "ml-2 text-sm text-gray-500", children: "Average" })] }), _jsxs("div", { className: "text-sm text-gray-600 space-y-1", children: [_jsxs("div", { children: ["Best: ", subjectScore.bestScore, "%"] }), _jsxs("div", { children: ["Attempts: ", subjectScore.attempts] }), _jsxs("div", { children: ["Grade: ", getScoreRemark(subjectScore.score)] })] })] }, subjectScore.subject))) })] }) }))] })), activeTab === 'announcements' && (_jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "All Announcements" }), _jsxs("div", { className: "space-y-4", children: [announcements.map((announcement) => (_jsxs("div", { className: "border-l-4 border-blue-400 bg-blue-50 p-4 rounded", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "text-md font-medium text-gray-900", children: announcement.title }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                                announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-blue-100 text-blue-800'}`, children: announcement.priority })] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: announcement.message }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(announcement.created_at).toLocaleDateString() })] }, announcement.id))), announcements.length === 0 && (_jsx("p", { className: "text-center text-gray-500 py-8", children: "No announcements available." }))] })] }) }))] })] }));
};
export default ParticipantDashboard;
