// src/pages/dashboards/ParticipantDashboard.tsx
import React, { useEffect, useState, useRef } from "react";
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

interface ProfilePicture {
  id: string;
  participant_id: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

const ParticipantDashboard: React.FC = () => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState<QuizInfo[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [profilePicture, setProfilePicture] = useState<ProfilePicture | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Fetch profile picture
  const fetchProfilePicture = async (participantId: string) => {
    try {
      const { data, error } = await supabase
        .from("profile_pictures")
        .select("*")
        .eq("participant_id", participantId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Error fetching profile picture:", error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
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

  // Check if a quiz has been attempted
  const hasQuizBeenAttempted = (quizId: string): boolean => {
    return quizAttempts.some(attempt => attempt.quiz_id === quizId);
  };

  // Get quiz attempt status for a specific quiz
  const getQuizAttemptStatus = (quizId: string): 'not_attempted' | 'in_progress' | 'completed' | 'abandoned' => {
    const attempt = quizAttempts.find(attempt => attempt.quiz_id === quizId);
    if (!attempt) return 'not_attempted';
    return attempt.status;
  };

  // Get the attempt result for a specific quiz
  const getQuizAttemptResult = (quizId: string): { score: number; percentage: number; passed: boolean } | null => {
    const attempt = quizAttempts.find(attempt => 
      attempt.quiz_id === quizId && attempt.status === 'completed'
    );
    
    if (!attempt) return null;
    
    const percentage = attempt.percentage || 
      (attempt.total_questions > 0 ? 
        Math.round((attempt.correct_answers / attempt.total_questions) * 100) : 0);
    
    return {
      score: attempt.score || 0,
      percentage,
      passed: percentage >= (attempt.quizzes?.passing_score || 50)
    };
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
    
    // Convert scores to numbers before adding!
    const totalScore = completedAttempts.reduce((sum, attempt) => {
      // Get the score and ensure it's a number
      const score = attempt.score || attempt.percentage || 0;
      const numericScore = Number(score);
      return sum + numericScore;
    }, 0);
    
    // Each quiz is worth 100 marks
    const totalPossible = completedAttempts.length * 100;
    
    // Calculate percentage: (152 / 200) × 100 = 76%
    const overallPercentage = totalPossible > 0 ? 
      Math.round((totalScore / totalPossible) * 100) : 0;
    
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

  // Handle quiz start
  const handleStartQuiz = (quiz: QuizInfo) => {
    if (hasQuizBeenAttempted(quiz.id)) {
      Swal.fire({
        title: 'Quiz Already Attempted',
        text: 'You have already attempted this quiz. You cannot take it again.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    navigate(quiz.link);
  };

  // View quiz results
  const handleViewQuizResults = (quizId: string) => {
    const attempt = quizAttempts.find(attempt => attempt.quiz_id === quizId);
    if (attempt) {
      Swal.fire({
        title: 'Quiz Results',
        html: `
          <div class="text-left">
            <p><strong>Score:</strong> ${attempt.score || 0}</p>
            <p><strong>Correct Answers:</strong> ${attempt.correct_answers || 0}/${attempt.total_questions || 0}</p>
            <p><strong>Percentage:</strong> ${attempt.percentage || 0}%</p>
            <p><strong>Status:</strong> ${attempt.status}</p>
            <p><strong>Completed:</strong> ${new Date(attempt.completed_at).toLocaleDateString()}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
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

  // Upload profile picture
  const uploadProfilePicture = async (file: File, participantId: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Show upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${participantId}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        clearInterval(progressInterval);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update or insert profile picture record
      const { data: profileData, error: profileError } = await supabase
        .from('profile_pictures')
        .upsert({
          participant_id: participantId,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'participant_id'
        })
        .select()
        .single();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (profileError) {
        throw profileError;
      }

      // Update local state
      setProfilePicture(profileData);

      // Add a small delay for smooth UI transition
      setTimeout(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Profile picture uploaded successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      setIsUploading(false);
      setUploadProgress(0);
      
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to upload profile picture.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Delete profile picture
  const deleteProfilePicture = async (participantId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove your profile picture.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      // Get current profile picture
      const { data: currentPic } = await supabase
        .from('profile_pictures')
        .select('avatar_url')
        .eq('participant_id', participantId)
        .single();

      // Delete from storage if exists
      if (currentPic?.avatar_url) {
        const urlParts = currentPic.avatar_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const fullPath = `${participantId}/${fileName}`;

        await supabase.storage
          .from('avatars')
          .remove([fullPath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('profile_pictures')
        .delete()
        .eq('participant_id', participantId);

      if (error) throw error;

      // Update local state
      setProfilePicture(null);

      Swal.fire({
        title: 'Deleted!',
        text: 'Your profile picture has been removed.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error: any) {
      console.error("Error deleting profile picture:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to delete profile picture.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Handle file input change
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !participant) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Please upload an image smaller than 5MB.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    await uploadProfilePicture(file, participant.id);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    if (profilePicture?.avatar_url) {
      return profilePicture.avatar_url;
    }
    // Fallback to avatar generator
    return `https://ui-avatars.com/api/?name=${participant?.fullName}&background=random&size=128&bold=true`;
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
        const [attempts, resourcesData, quizzesData, announcementsData, profilePicData] = await Promise.all([
          fetchQuizAttempts(participantData.id),
          fetchResources(),
          fetchQuizzes(participantData.classLevel),
          fetchAnnouncements(),
          fetchProfilePicture(participantData.id)
        ]);

        setQuizAttempts(attempts);
        setResources(resourcesData);
        setQuizzes(quizzesData);
        setAnnouncements(announcementsData);
        setProfilePicture(profilePicData);
        
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
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

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
              {/* Profile Picture Section */}
              <div className="relative group">
                <div className="relative">
                  <img
                    className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover"
                    src={getAvatarUrl()}
                    alt="Profile"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${participant?.fullName}&background=random&size=128&bold=true`;
                    }}
                  />
                  
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="text-white text-sm font-medium p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                      title="Change profile picture"
                    >
                      {isUploading ? (
                        <div className="relative">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {uploadProgress > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                              {uploadProgress}%
                            </div>
                          )}
                        </div>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                
                 
                </div>

                {/* Upload Progress Bar (outside the image) */}
                {isUploading && (
                  <div className="mt-2 w-20">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                    </p>
                  </div>
                )}
              </div>

              <div className="ml-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
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
                      {profilePicture && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          📸 Profile Picture
                        </span>
                      )}
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

            {/* Profile Picture Instructions */}
            {!profilePicture && !isUploading && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    Click on the camera icon to upload your profile picture. Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
                  </p>
                </div>
              </div>
            )}
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
                {quizzes.map((quiz) => {
                  const isAttempted = hasQuizBeenAttempted(quiz.id);
                  const attemptStatus = getQuizAttemptStatus(quiz.id);
                  const attemptResult = getQuizAttemptResult(quiz.id);
                  const isQuizActive = quiz.status === 'active';

                  return (
                    <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-md font-medium text-gray-900">{quiz.title}</h4>
                        <div className="flex flex-col items-end">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            quiz.status === 'active' ? 'bg-green-100 text-green-800' :
                            quiz.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {quiz.status}
                          </span>
                          {isAttempted && (
                            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              attemptStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                              attemptStatus === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {attemptStatus === 'completed' ? 'Completed' :
                               attemptStatus === 'in_progress' ? 'In Progress' : 'Attempted'}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{quiz.subject}</p>
                      <p className="text-xs text-gray-500 mb-3">{quiz.instructions}</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>Duration: {quiz.duration}m</span>
                        <span>Questions: {quiz.total_questions}</span>
                      </div>
                      
                      {/* Show attempt result if completed */}
                      {attemptResult && (
                        <div className="mb-3 p-2 bg-gray-50 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Your Score:</span>
                            <span className={`text-sm font-bold ${
                              attemptResult.passed ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {attemptResult.percentage}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {attemptResult.passed ? 'Passed' : 'Failed'} • {attemptResult.score} points
                          </div>
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        {isQuizActive && !isAttempted && (
                          <button
                            onClick={() => handleStartQuiz(quiz)}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Start Quiz
                          </button>
                        )}
                        
                        {isAttempted && (
                          <button
                            onClick={() => handleViewQuizResults(quiz.id)}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            View Results
                          </button>
                        )}
                        
                        {isQuizActive && isAttempted && (
                          <button
                            disabled
                            className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                            title="Quiz already attempted"
                          >
                            Already Attempted
                          </button>
                        )}
                        
                        {quiz.status === 'upcoming' && (
                          <button
                            disabled
                            className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                            title="Quiz not yet available"
                          >
                            Coming Soon
                          </button>
                        )}
                        
                        {quiz.status === 'completed' && !isAttempted && (
                          <button
                            disabled
                            className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                            title="Quiz has ended"
                          >
                            Quiz Ended
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
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