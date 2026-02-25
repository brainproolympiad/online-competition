// src/pages/dashboards/ParticipantDashboard.js
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const ParticipantDashboard = () => {
  const [participant, setParticipant] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [authError, setAuthError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Configure SweetAlert2 for top-right notifications
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'custom-toast'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  // Custom showAlert function for top-right notifications
  const showAlert = (icon, title, text, timer = 3000) => {
    return Toast.fire({
      icon,
      title,
      text,
      timer,
      timerProgressBar: true
    });
  };

  // Custom showProgressAlert function for upload progress
  const showProgressAlert = (title, progress) => {
    return Swal.fire({
      title,
      html: `
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
          </div>
          <p class="mt-2 text-sm text-gray-600">${progress}% uploaded</p>
        </div>
      `,
      position: 'top-end',
      showConfirmButton: false,
      allowOutsideClick: false,
      showCloseButton: true
    });
  };

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

      if (error) throw error;
      return data;
    } catch (error) {
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
  const fetchQuizzes = async (participantClass) => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
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
  const fetchProfilePicture = async (participantId) => {
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
  const normalizeClassLevel = (classLevel) => {
    if (!classLevel) return '';
    return classLevel
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/^JSS\s*(\d)$/, 'JSS $1')
      .replace(/^SS\s*(\d)$/, 'SS $1');
  };

  const filterQuizzesByClass = (quizzes, participantClass) => {
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

  const getQuizStatus = (quiz) => {
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

  const formatCourses = (courses) => {
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

  const formatTimeSpent = (seconds) => {
    if (!seconds) return "N/A";
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
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    if (score >= 50) return "Pass";
    return "Needs Improvement";
  };

  // Check if a quiz has been attempted
  const hasQuizBeenAttempted = (quizId) => {
    return quizAttempts.some(attempt => attempt.quiz_id === quizId);
  };

  // Get quiz attempt status for a specific quiz
  const getQuizAttemptStatus = (quizId) => {
    const attempt = quizAttempts.find(attempt => attempt.quiz_id === quizId);
    if (!attempt) return 'not_attempted';
    return attempt.status;
  };

  // Get the attempt result for a specific quiz
  const getQuizAttemptResult = (quizId) => {
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
    const completedAttempts = quizAttempts.filter(attempt => 
      attempt.status === 'completed'
    );
    
    // Convert scores to numbers before adding
    const totalScore = completedAttempts.reduce((sum, attempt) => {
      const score = attempt.score || attempt.percentage || 0;
      const numericScore = Number(score);
      return sum + numericScore;
    }, 0);
    
    // Each quiz is worth 100 marks
    const totalPossible = completedAttempts.length * 100;
    
    // Calculate percentage
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
  const handleStartQuiz = (quiz) => {
    if (!profilePicture) {
      showAlert('warning', 'Profile Picture Required', 'Please upload a profile picture before accessing quizzes.');
      return;
    }

    if (hasQuizBeenAttempted(quiz.id)) {
      showAlert('info', 'Quiz Already Attempted', 'You have already attempted this quiz. You cannot take it again.');
      return;
    }
    
    navigate(quiz.link);
  };

  // View quiz results
  const handleViewQuizResults = (quizId) => {
    if (!profilePicture) {
      showAlert('warning', 'Profile Picture Required', 'Please upload a profile picture to view quiz results.');
      return;
    }

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
        position: 'top-end',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        timer: 5000,
        timerProgressBar: true
      });
    }
  };

  // Refresh scores
  const refreshScores = async () => {
    if (!profilePicture) {
      showAlert('warning', 'Profile Picture Required', 'Please upload a profile picture to refresh scores.');
      return;
    }

    if (participant) {
      const attempts = await fetchQuizAttempts(participant.id);
      setQuizAttempts(attempts);
      
      const completedCount = attempts.filter(a => a.status === 'completed').length;
      
      if (completedCount > 0) {
        showAlert('success', 'Scores Updated!', `Found ${completedCount} completed quizzes.`);
      } else {
        showAlert('info', 'No Quizzes Found', 'No completed quizzes found.');
      }
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file, participantId) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Show initial progress alert
    let progressAlert = showProgressAlert('Uploading Profile Picture', 0);
    
    try {
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${participantId}_${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
            
            // Update progress alert
            if (progressAlert && progressAlert.update) {
              progressAlert.update({
                html: `
                  <div class="mt-4">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
                    </div>
                    <p class="mt-2 text-sm text-gray-600">${percent}% uploaded</p>
                  </div>
                `
              });
            }
          }
        });

      if (uploadError) {
        progressAlert.close();
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update progress to 90% (processing)
      setUploadProgress(90);
      if (progressAlert && progressAlert.update) {
        progressAlert.update({
          html: `
            <div class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: 90%"></div>
              </div>
              <p class="mt-2 text-sm text-gray-600">Processing upload...</p>
            </div>
          `
        });
      }

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

      setUploadProgress(100);

      if (profileError) {
        throw profileError;
      }

      // Update local state
      setProfilePicture(profileData);

      // Close progress alert and show success
      if (progressAlert && progressAlert.close) {
        progressAlert.close();
      }

      // Add a small delay for smooth UI transition
      setTimeout(() => {
        showAlert('success', 'Success!', 'Profile picture uploaded successfully. Dashboard features are now enabled.', 4000);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setIsUploading(false);
      setUploadProgress(0);
      
      if (progressAlert && progressAlert.close) {
        progressAlert.close();
      }
      
      showAlert('error', 'Upload Failed', error.message || 'Failed to upload profile picture.');
    }
  };

  // Handle file input change
  const handleFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !participant) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showAlert('error', 'Invalid File', 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showAlert('error', 'File Too Large', 'Please upload an image smaller than 5MB.');
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking a tab
  const handleTabClick = (tab) => {
    if (!profilePicture) {
      showAlert('warning', 'Profile Picture Required', 'Please upload a profile picture to access dashboard features.');
      return;
    }
    
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Handle tab click with profile picture check
  const handleTabChange = (tab) => {
    if (!profilePicture) {
      showAlert('warning', 'Profile Picture Required', 'Please upload a profile picture to access dashboard features.');
      return;
    }
    
    setActiveTab(tab);
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
    return React.createElement("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center" },
      React.createElement("div", { className: "text-center" },
        React.createElement("div", { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" }),
        React.createElement("h2", { className: "text-xl font-semibold text-gray-700" }, "Loading Your Dashboard...")
      )
    );
  }

  // Auth error state
  if (authError) {
    return React.createElement("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4" },
      React.createElement("div", { className: "max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center" },
        React.createElement("div", { className: "text-6xl mb-4" }, "🔐"),
        React.createElement("h2", { className: "text-2xl font-bold text-gray-800 mb-4" }, "Authentication Required"),
        React.createElement("p", { className: "text-gray-600 mb-6" }, authError),
        React.createElement("div", { className: "space-y-3" },
          React.createElement("button", {
            onClick: handleLoginRedirect,
            className: "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          }, "Go to Login"),
          React.createElement("button", {
            onClick: handleRegisterRedirect,
            className: "w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          }, "Go to Registration")
        )
      )
    );
  }

  const courseArray = formatCourses(participant?.courses || []);
  const participantClass = participant?.classLevel;
  const subjectScores = getSubjectScoresFromAttempts();
  const stats = calculateOverallStats();

  // If no profile picture is uploaded, show only upload interface
  if (!profilePicture) {
    return React.createElement("div", { className: "min-h-screen bg-gray-50" },
      // Hidden file input
      React.createElement("input", {
        type: "file",
        ref: fileInputRef,
        onChange: handleFileInputChange,
        accept: "image/*",
        className: "hidden"
      }),

      // Header
      React.createElement("div", { className: "bg-white shadow-sm border-b" },
        React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
          React.createElement("div", { className: "flex justify-between items-center py-4" },
            React.createElement("div", { className: "flex items-center space-x-4" },
              React.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Student Dashboard"),
              React.createElement("div", { className: "text-sm text-gray-500 truncate max-w-xs" },
                "Welcome, ", participant?.fullName
              )
            ),
            React.createElement("button", {
              onClick: handleLogout,
              className: "bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            }, "Logout")
          )
        )
      ),

      // Main Content - Upload Required
      React.createElement("div", { className: "max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8" },
        React.createElement("div", { className: "max-w-3xl mx-auto" },
          // Profile Upload Card
          React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg" },
            React.createElement("div", { className: "px-4 py-5 sm:p-6" },
              React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100 mb-6" },
                  React.createElement("svg", { className: "h-12 w-12 text-yellow-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
                  )
                ),
                React.createElement("h3", { className: "text-2xl font-bold text-gray-900 mb-2" }, "Profile Picture Required"),
                React.createElement("p", { className: "text-gray-600 mb-8" },
                  "You must upload a profile picture before you can access the dashboard features."
                ),

                // Current Profile Preview
                React.createElement("div", { className: "mb-8" },
                  React.createElement("h4", { className: "text-lg font-medium text-gray-900 mb-4" }, "Current Profile"),
                  React.createElement("div", { className: "flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8" },
                    React.createElement("div", { className: "text-center" },
                      React.createElement("img", {
                        className: "h-32 w-32 rounded-full border-4 border-gray-200 object-cover mx-auto",
                        src: getAvatarUrl(),
                        alt: "Current Profile"
                      }),
                      React.createElement("p", { className: "mt-2 text-sm text-gray-500" }, "Current Display")
                    ),
                    React.createElement("div", { className: "text-center" },
                      React.createElement("div", { className: "h-32 w-32 rounded-full border-4 border-blue-500 border-dashed bg-gray-50 flex items-center justify-center mx-auto" },
                        isUploading ?
                          React.createElement("div", { className: "text-center" },
                            React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2" }),
                            React.createElement("p", { className: "text-xs text-gray-500" }, `Uploading... ${uploadProgress}%`)
                          ) :
                          React.createElement("svg", { className: "h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" })
                          )
                      ),
                      React.createElement("p", { className: "mt-2 text-sm text-gray-500" }, "Upload New Picture")
                    )
                  )
                ),

                // Upload Button
                React.createElement("div", null,
                  React.createElement("button", {
                    onClick: triggerFileInput,
                    disabled: isUploading,
                    className: isUploading ? 
                      "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 opacity-50 cursor-not-allowed" :
                      "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  },
                    isUploading ?
                      React.createElement(React.Fragment, null,
                        React.createElement("svg", { 
                          className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", 
                          xmlns: "http://www.w3.org/2000/svg", 
                          fill: "none", 
                          viewBox: "0 0 24 24" 
                        },
                          React.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                          React.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                        ),
                        `Uploading... ${uploadProgress}%`
                      ) :
                      React.createElement(React.Fragment, null,
                        React.createElement("svg", { 
                          className: "-ml-1 mr-3 h-5 w-5", 
                          fill: "none", 
                          stroke: "currentColor", 
                          viewBox: "0 0 24 24" 
                        },
                          React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" })
                        ),
                        "Upload Profile Picture"
                      )
                  ),
                  React.createElement("p", { className: "mt-3 text-sm text-gray-500" },
                    "Supported formats: JPEG, PNG, GIF, WebP (max 5MB)"
                  )
                ),

                // Important Notice
                React.createElement("div", { className: "mt-10 p-4 bg-yellow-50 border-l-4 border-yellow-400" },
                  React.createElement("div", { className: "flex" },
                    React.createElement("svg", { 
                      className: "h-5 w-5 text-yellow-400", 
                      fill: "none", 
                      stroke: "currentColor", 
                      viewBox: "0 0 24 24" 
                    },
                      React.createElement("path", { 
                        strokeLinecap: "round", 
                        strokeLinejoin: "round", 
                        strokeWidth: "2", 
                        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.404 16.5c-.77.833.192 2.5 1.732 2.5z" 
                      })
                    ),
                    React.createElement("div", { className: "ml-3" },
                      React.createElement("h3", { className: "text-sm font-medium text-yellow-800" }, "Important Notice"),
                      React.createElement("div", { className: "mt-2 text-sm text-yellow-700" },
                        React.createElement("p", null,
                          "All dashboard features (quizzes, resources, scores, etc.) will be disabled until a profile picture is uploaded."
                        )
                      )
                    )
                  )
                )
              )
            )
          ),

          // Disabled Dashboard Preview
          React.createElement("div", { className: "mt-8 bg-white overflow-hidden shadow rounded-lg opacity-50 cursor-not-allowed" },
            React.createElement("div", { className: "px-4 py-5 sm:p-6" },
              React.createElement("div", { className: "flex items-center justify-between mb-4" },
                React.createElement("h3", { className: "text-lg font-medium text-gray-900" }, "Dashboard Preview"),
                React.createElement("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800" },
                  "Disabled"
                )
              ),
              React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2" },
                React.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                  React.createElement("div", { className: "flex items-center" },
                    React.createElement("div", { className: "flex-shrink-0" },
                      React.createElement("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" },
                        React.createElement("span", { className: "text-gray-400 text-lg" }, "📊")
                      )
                    ),
                    React.createElement("div", { className: "ml-4" },
                      React.createElement("h4", { className: "text-sm font-medium text-gray-900" }, "Quick Stats"),
                      React.createElement("p", { className: "text-sm text-gray-500" }, "Will be available after upload")
                    )
                  )
                ),
                React.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                  React.createElement("div", { className: "flex items-center" },
                    React.createElement("div", { className: "flex-shrink-0" },
                      React.createElement("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" },
                        React.createElement("span", { className: "text-gray-400 text-lg" }, "📝")
                      )
                    ),
                    React.createElement("div", { className: "ml-4" },
                      React.createElement("h4", { className: "text-sm font-medium text-gray-900" }, "Available Quizzes"),
                      React.createElement("p", { className: "text-sm text-gray-500" }, "Will be available after upload")
                    )
                  )
                ),
                React.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                  React.createElement("div", { className: "flex items-center" },
                    React.createElement("div", { className: "flex-shrink-0" },
                      React.createElement("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" },
                        React.createElement("span", { className: "text-gray-400 text-lg" }, "📚")
                      )
                    ),
                    React.createElement("div", { className: "ml-4" },
                      React.createElement("h4", { className: "text-sm font-medium text-gray-900" }, "Learning Resources"),
                      React.createElement("p", { className: "text-sm text-gray-500" }, "Will be available after upload")
                    )
                  )
                ),
                React.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                  React.createElement("div", { className: "flex items-center" },
                    React.createElement("div", { className: "flex-shrink-0" },
                      React.createElement("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" },
                        React.createElement("span", { className: "text-gray-400 text-lg" }, "🏆")
                      )
                    ),
                    React.createElement("div", { className: "ml-4" },
                      React.createElement("h4", { className: "text-sm font-medium text-gray-900" }, "Scores & Performance"),
                      React.createElement("p", { className: "text-sm text-gray-500" }, "Will be available after upload")
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  // If profile picture is uploaded, show full dashboard
  return React.createElement("div", { className: "min-h-screen bg-gray-50" },
    // Hidden file input
    React.createElement("input", {
      type: "file",
      ref: fileInputRef,
      onChange: handleFileInputChange,
      accept: "image/*",
      className: "hidden"
    }),

    // Mobile Header (for small screens)
    React.createElement("div", { className: "lg:hidden bg-white shadow-sm border-b" },
      React.createElement("div", { className: "px-4 sm:px-6" },
        React.createElement("div", { className: "flex justify-between items-center py-4" },
          React.createElement("div", { className: "flex items-center" },
            React.createElement("button", {
              onClick: toggleMobileMenu,
              className: "mr-3 text-gray-500 hover:text-gray-700"
            },
              React.createElement("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16" })
              )
            ),
            React.createElement("h1", { className: "text-lg font-bold text-gray-900" }, "Dashboard")
          ),
          React.createElement("button", {
            onClick: handleLogout,
            className: "bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700 transition-colors"
          }, "Logout")
        )
      )
    ),

    // Desktop Header
    React.createElement("div", { className: "hidden lg:block bg-white shadow-sm border-b" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
        React.createElement("div", { className: "flex justify-between items-center py-4" },
          React.createElement("div", { className: "flex items-center space-x-4" },
            React.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Student Dashboard"),
            React.createElement("div", { className: "text-sm text-gray-500 truncate max-w-xs" },
              "Welcome, ", participant?.fullName
            )
          ),
          React.createElement("button", {
            onClick: handleLogout,
            className: "bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          }, "Logout")
        )
      )
    ),

    // Mobile Menu Overlay
    isMobileMenuOpen && React.createElement("div", { className: "lg:hidden fixed inset-0 z-40" },
      React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-25", onClick: toggleMobileMenu })
    ),

    // Mobile Sidebar Menu
    React.createElement("div", { 
      className: `lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    },
      React.createElement("div", { className: "pt-5 pb-4 px-4" },
        React.createElement("div", { className: "flex items-center mb-8" },
          React.createElement("img", {
            className: "h-12 w-12 rounded-full border-2 border-gray-200 object-cover mr-3",
            src: getAvatarUrl(),
            alt: "Profile",
            onError: (e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${participant?.fullName}&background=random&size=128&bold=true`;
            }
          }),
          React.createElement("div", null,
            React.createElement("p", { className: "text-sm font-medium text-gray-900 truncate" }, participant?.fullName),
            React.createElement("p", { className: "text-xs text-gray-500 truncate" }, participant?.email)
          )
        ),
        React.createElement("nav", { className: "space-y-1" },
          ['overview', 'quizzes', 'resources', 'scores', 'announcements'].map((tab) =>
            React.createElement("button", {
              key: tab,
              onClick: () => handleTabClick(tab),
              className: `w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === tab
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            },
              tab.charAt(0).toUpperCase() + tab.slice(1)
            )
          ),
          React.createElement("button", {
            onClick: refreshScores,
            className: "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 mt-4"
          },
            React.createElement("svg", { className: "mr-3 h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
              React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" })
            ),
            "Refresh Scores"
          )
        )
      )
    ),

    // Main Content
    React.createElement("div", { className: "max-w-7xl mx-auto py-3 sm:py-6 px-3 sm:px-6 lg:px-8" },
      // Student Info Card
      React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg mb-4 sm:mb-6" },
        React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
          React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center" },
            // Profile Picture Section
            React.createElement("div", { className: "relative group self-center sm:self-start mb-4 sm:mb-0" },
              React.createElement("div", { className: "relative" },
                React.createElement("img", {
                  className: "h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-white shadow-lg object-cover",
                  src: getAvatarUrl(),
                  alt: "Profile",
                  onError: (e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${participant?.fullName}&background=random&size=128&bold=true`;
                  }
                }),
                
                // Change picture overlay
                !isUploading && React.createElement("div", { 
                  className: "absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                },
                  React.createElement("button", {
                    onClick: triggerFileInput,
                    disabled: isUploading,
                    className: "text-white text-sm font-medium p-1 sm:p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200",
                    title: "Change profile picture"
                  },
                    React.createElement("svg", { 
                      className: "w-4 h-4 sm:w-6 sm:h-6", 
                      fill: "none", 
                      stroke: "currentColor", 
                      viewBox: "0 0 24 24" 
                    },
                      React.createElement("path", { 
                        strokeLinecap: "round", 
                        strokeLinejoin: "round", 
                        strokeWidth: "2", 
                        d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                      })
                    )
                  )
                )
              ),

              // Upload Progress Bar
              isUploading && React.createElement("div", { className: "mt-2 w-16 sm:w-20" },
                React.createElement("div", { className: "h-1 bg-gray-200 rounded-full overflow-hidden" },
                  React.createElement("div", { 
                    className: "h-full bg-blue-600 transition-all duration-300",
                    style: { width: uploadProgress + "%" }
                  })
                ),
                React.createElement("p", { className: "text-xs text-gray-500 text-center mt-1" },
                  uploadProgress < 100 ? 'Uploading...' : 'Processing...'
                )
              )
            ),

            React.createElement("div", { className: "sm:ml-6 flex-1" },
              React.createElement("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-start" },
                React.createElement("div", null,
                  React.createElement("h3", { className: "text-lg leading-6 font-medium text-gray-900 text-center sm:text-left" },
                    participant?.fullName
                  ),
                  React.createElement("p", { className: "mt-1 text-sm text-gray-500 text-center sm:text-left" },
                    participant?.email
                  ),
                  React.createElement("div", { className: "mt-2 flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start" },
                    React.createElement("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" },
                      "🏫 ", participantClass
                    ),
                    React.createElement("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" },
                      "📚 ", courseArray.length, " Courses"
                    ),
                    React.createElement("span", {
                      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        participant?.paid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`
                    },
                      "💳 ", participant?.paid ? "Paid" : "Unpaid"
                    ),
                    React.createElement("span", { 
                      className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    }, "📸 Profile Picture")
                  )
                ),
                React.createElement("div", { className: "mt-4 sm:mt-0" },
                  React.createElement("button", {
                    onClick: refreshScores,
                    className: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  }, "Refresh Scores")
                )
              )
            )
          ),

          // Success Message (when profile picture exists)
          React.createElement("div", { className: "mt-4 p-3 bg-green-50 rounded-lg border border-green-200" },
            React.createElement("div", { className: "flex items-center" },
              React.createElement("svg", { 
                className: "w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2", 
                fill: "none", 
                stroke: "currentColor", 
                viewBox: "0 0 24 24" 
              },
                React.createElement("path", { 
                  strokeLinecap: "round", 
                  strokeLinejoin: "round", 
                  strokeWidth: "2", 
                  d: "M5 13l4 4L19 7" 
                })
              ),
              React.createElement("p", { className: "text-xs sm:text-sm text-green-700" },
                "Profile picture uploaded! All dashboard features are enabled. Hover over the image to change it."
              )
            )
          )
        )
      ),

      // Desktop Navigation Tabs
      React.createElement("div", { className: "hidden lg:block bg-white shadow-sm rounded-lg mb-6" },
        React.createElement("div", { className: "border-b border-gray-200" },
          React.createElement("nav", { className: "-mb-px flex space-x-8 px-6" },
            ['overview', 'quizzes', 'resources', 'scores', 'announcements'].map((tab) =>
              React.createElement("button", {
                key: tab,
                onClick: () => handleTabChange(tab),
                className: `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              },
                tab.charAt(0).toUpperCase() + tab.slice(1)
              )
            )
          )
        )
      ),

      // Tab Content
      activeTab === 'overview' && React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2" },
        // Quick Stats
        React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg" },
          React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
            React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Quick Stats"),
            React.createElement("dl", { className: "grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2" },
              React.createElement("div", { className: "px-3 sm:px-4 py-3 sm:py-4 bg-white shadow rounded-lg overflow-hidden sm:p-4" },
                React.createElement("dt", { className: "text-xs sm:text-sm font-medium text-gray-500 truncate" }, "Completed Exams"),
                React.createElement("dd", { className: "mt-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900" }, stats.completedExams)
              ),
              React.createElement("div", { className: "px-3 sm:px-4 py-3 sm:py-4 bg-white shadow rounded-lg overflow-hidden sm:p-4" },
                React.createElement("dt", { className: "text-xs sm:text-sm font-medium text-gray-500 truncate" }, "Overall Score"),
                React.createElement("dd", { className: "mt-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900" }, `${stats.overallPercentage}%`)
              )
            )
          )
        ),

        // Upcoming Quizzes
        React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg" },
          React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
            React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Upcoming Quizzes"),
            React.createElement("div", { className: "space-y-2 sm:space-y-3" },
              quizzes.filter(q => q.status === 'upcoming').slice(0, 3).map((quiz) =>
                React.createElement("div", { key: quiz.id, className: "flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md" },
                  React.createElement("div", { className: "mb-1 sm:mb-0" },
                    React.createElement("h4", { className: "text-xs sm:text-sm font-medium text-gray-900 truncate" }, quiz.title),
                    React.createElement("p", { className: "text-xs text-gray-500" }, quiz.subject)
                  ),
                  React.createElement("span", { className: "text-xs text-gray-500" },
                    new Date(quiz.start_time).toLocaleDateString()
                  )
                )
              ),
              quizzes.filter(q => q.status === 'upcoming').length === 0 &&
                React.createElement("p", { className: "text-sm text-gray-500 text-center py-4" }, "No upcoming quizzes")
            )
          )
        ),

        // Recent Announcements
        React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg lg:col-span-2" },
          React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
            React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Recent Announcements"),
            React.createElement("div", { className: "space-y-3 sm:space-y-4" },
              announcements.slice(0, 3).map((announcement) =>
                React.createElement("div", { key: announcement.id, className: "border-l-4 border-blue-400 bg-blue-50 p-3 sm:p-4 rounded" },
                  React.createElement("h4", { className: "text-sm font-medium text-gray-900" }, announcement.title),
                  React.createElement("p", { className: "text-xs sm:text-sm text-gray-600 mt-1" }, announcement.message),
                  React.createElement("p", { className: "text-xs text-gray-500 mt-2" },
                    new Date(announcement.created_at).toLocaleDateString()
                  )
                )
              ),
              announcements.length === 0 &&
                React.createElement("p", { className: "text-sm text-gray-500 text-center py-4" }, "No announcements")
            )
          )
        )
      ),

      activeTab === 'quizzes' && React.createElement("div", { className: "bg-white shadow rounded-lg" },
        React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
          React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Available Quizzes"),
          React.createElement("div", { className: "grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3" },
            quizzes.map((quiz) => {
              const isAttempted = hasQuizBeenAttempted(quiz.id);
              const attemptStatus = getQuizAttemptStatus(quiz.id);
              const attemptResult = getQuizAttemptResult(quiz.id);
              const isQuizActive = quiz.status === 'active';

              return React.createElement("div", { key: quiz.id, className: "border border-gray-200 rounded-lg p-3 sm:p-4" },
                React.createElement("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2" },
                  React.createElement("h4", { className: "text-sm sm:text-md font-medium text-gray-900 mb-1 sm:mb-0" }, quiz.title),
                  React.createElement("div", { className: "flex flex-col sm:items-end" },
                    React.createElement("span", {
                      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        quiz.status === 'active' ? 'bg-green-100 text-green-800' :
                        quiz.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`
                    }, quiz.status),
                    isAttempted &&
                      React.createElement("span", {
                        className: "mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      },
                        attemptStatus === 'completed' ? 'Completed' :
                         attemptStatus === 'in_progress' ? 'In Progress' : 'Attempted'
                      )
                  )
                ),
                React.createElement("p", { className: "text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" }, quiz.subject),
                React.createElement("p", { className: "text-xs text-gray-500 mb-2 sm:mb-3 line-clamp-2" }, quiz.instructions),
                React.createElement("div", { className: "flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 mb-2 sm:mb-3" },
                  React.createElement("span", { className: "mb-1 sm:mb-0" }, `Duration: ${quiz.duration}m`),
                  React.createElement("span", null, `Questions: ${quiz.total_questions}`)
                ),
                
                // Show attempt result if completed
                attemptResult &&
                  React.createElement("div", { className: "mb-2 sm:mb-3 p-2 bg-gray-50 rounded" },
                    React.createElement("div", { className: "flex justify-between items-center" },
                      React.createElement("span", { className: "text-xs sm:text-sm font-medium" }, "Your Score:"),
                      React.createElement("span", {
                        className: `text-xs sm:text-sm font-bold ${
                          attemptResult.passed ? 'text-green-600' : 'text-red-600'
                        }`
                      }, `${attemptResult.percentage}%`)
                    ),
                    React.createElement("div", { className: "text-xs text-gray-500 mt-1" },
                      `${attemptResult.passed ? 'Passed' : 'Failed'} • ${attemptResult.score} points`
                    )
                  ),
                
                // Action buttons
                React.createElement("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2" },
                  isQuizActive && !isAttempted &&
                    React.createElement("button", {
                      onClick: () => handleStartQuiz(quiz),
                      className: "bg-blue-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                    }, "Start Quiz"),
                  
                  isAttempted &&
                    React.createElement("button", {
                      onClick: () => handleViewQuizResults(quiz.id),
                      className: "bg-green-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
                    }, "View Results"),
                  
                  isQuizActive && isAttempted &&
                    React.createElement("button", {
                      disabled: true,
                      className: "bg-gray-400 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium cursor-not-allowed opacity-50",
                      title: "Quiz already attempted"
                    }, "Already Attempted"),
                  
                  quiz.status === 'upcoming' &&
                    React.createElement("button", {
                      disabled: true,
                      className: "bg-gray-400 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium cursor-not-allowed opacity-50",
                      title: "Quiz not yet available"
                    }, "Coming Soon"),
                  
                  quiz.status === 'completed' && !isAttempted &&
                    React.createElement("button", {
                      disabled: true,
                      className: "bg-gray-400 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium cursor-not-allowed opacity-50",
                      title: "Quiz has ended"
                    }, "Quiz Ended")
                )
              );
            }),
            quizzes.length === 0 &&
              React.createElement("div", { className: "col-span-full text-center py-8" },
                React.createElement("p", { className: "text-gray-500" }, "No quizzes available for your class.")
              )
          )
        )
      ),

      activeTab === 'resources' && React.createElement("div", { className: "bg-white shadow rounded-lg" },
        React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
          React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Learning Resources"),
          React.createElement("div", { className: "grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3" },
            resources.map((resource) =>
              React.createElement("div", { key: resource.id, className: "border border-gray-200 rounded-lg p-3 sm:p-4" },
                React.createElement("div", { className: "flex items-center mb-2" },
                  React.createElement("span", { className: "text-lg mr-2" },
                    resource.type === 'video' ? '🎬' :
                     resource.type === 'quiz' ? '📝' :
                     resource.type === 'assignment' ? '📋' : '📄'
                  ),
                  React.createElement("h4", { className: "text-sm sm:text-md font-medium text-gray-900 truncate" }, resource.title)
                ),
                React.createElement("p", { className: "text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2" }, resource.description),
                React.createElement("a", {
                  href: resource.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center justify-center px-3 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors w-full"
                }, "Open Resource")
              )
            )
          )
        )
      ),

      activeTab === 'scores' && React.createElement("div", { className: "space-y-4 sm:space-y-6" },
        // Overall Performance
        React.createElement("div", { className: "bg-white shadow rounded-lg" },
          React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
            React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Overall Performance"),
            React.createElement("div", { className: "grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-3" },
              React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg" },
                React.createElement("div", { className: "px-3 sm:px-4 py-3 sm:py-4 sm:p-4" },
                  React.createElement("dt", { className: "text-xs sm:text-sm font-medium text-gray-500 truncate" }, "Completed Exams"),
                  React.createElement("dd", { className: "mt-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900" }, stats.completedExams)
                )
              ),
              React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg" },
                React.createElement("div", { className: "px-3 sm:px-4 py-3 sm:py-4 sm:p-4" },
                  React.createElement("dt", { className: "text-xs sm:text-sm font-medium text-gray-500 truncate" }, "Average Score"),
                  React.createElement("dd", { className: "mt-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900" }, `${stats.overallPercentage}%`)
                )
              ),
              React.createElement("div", { className: "bg-white overflow-hidden shadow rounded-lg" },
                React.createElement("div", { className: "px-3 sm:px-4 py-3 sm:py-4 sm:p-4" },
                  React.createElement("dt", { className: "text-xs sm:text-sm font-medium text-gray-500 truncate" }, "Total Time"),
                  React.createElement("dd", { className: "mt-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900" },
                    `${Math.round(stats.totalTimeSpent / 60)}m`
                  )
                )
              )
            )
          )
        ),

        // Quiz History
        React.createElement("div", { className: "bg-white shadow rounded-lg" },
          React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
            React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Quiz History"),
            quizAttempts.filter(attempt => attempt.status === 'completed').length === 0 ?
              React.createElement("div", { className: "text-center py-8" },
                React.createElement("p", { className: "text-gray-500" }, "No completed quizzes yet.")
              ) :
              React.createElement("div", { className: "overflow-x-auto -mx-3 sm:mx-0" },
                React.createElement("div", { className: "inline-block min-w-full align-middle" },
                  React.createElement("table", { className: "min-w-full divide-y divide-gray-300" },
                    React.createElement("thead", { className: "bg-gray-50" },
                      React.createElement("tr", null,
                        React.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Quiz"),
                        React.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Subject"),
                        React.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Score"),
                        React.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Status"),
                        React.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Date")
                      )
                    ),
                    React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" },
                      quizAttempts
                        .filter(attempt => attempt.status === 'completed')
                        .slice(0, 10)
                        .map((attempt) => {
                          const percentage = attempt.percentage || 
                            (attempt.total_questions > 0 ? 
                              Math.round((attempt.correct_answers / attempt.total_questions) * 100) : 0);
                          const passed = percentage >= (attempt.quizzes?.passing_score || 50);

                          return React.createElement("tr", { key: attempt.id },
                            React.createElement("td", { className: "px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none" },
                              attempt.quizzes?.title
                            ),
                            React.createElement("td", { className: "px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500" },
                              formatSubjectName(attempt.quizzes?.subject)
                            ),
                            React.createElement("td", { className: "px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900" },
                              `${percentage}% (${attempt.correct_answers}/${attempt.total_questions})`
                            ),
                            React.createElement("td", { className: "px-3 sm:px-6 py-3 whitespace-nowrap" },
                              React.createElement("span", {
                                className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`
                              }, passed ? 'Passed' : 'Failed')
                            ),
                            React.createElement("td", { className: "px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500" },
                              new Date(attempt.completed_at).toLocaleDateString()
                            )
                          );
                        })
                    )
                  )
                )
              )
          )
        ),

        // Subject Performance
        subjectScores.length > 0 &&
          React.createElement("div", { className: "bg-white shadow rounded-lg" },
            React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
              React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "Subject Performance"),
              React.createElement("div", { className: "grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3" },
                subjectScores.map((subjectScore) =>
                  React.createElement("div", { key: subjectScore.subject, className: "border border-gray-200 rounded-lg p-3 sm:p-4" },
                    React.createElement("h4", { className: "text-sm sm:text-md font-medium text-gray-900 mb-2 truncate" },
                      subjectScore.displayName
                    ),
                    React.createElement("div", { className: "flex items-baseline mb-2" },
                      React.createElement("span", { className: "text-lg sm:text-xl font-bold text-gray-900" },
                        `${subjectScore.score}%`
                      ),
                      React.createElement("span", { className: "ml-2 text-xs sm:text-sm text-gray-500" }, "Average")
                    ),
                    React.createElement("div", { className: "text-xs sm:text-sm text-gray-600 space-y-1" },
                      React.createElement("div", null, `Best: ${subjectScore.bestScore}%`),
                      React.createElement("div", null, `Attempts: ${subjectScore.attempts}`),
                      React.createElement("div", null, `Grade: ${getScoreRemark(subjectScore.score)}`)
                    )
                  )
                )
              )
            )
          )
      ),

      activeTab === 'announcements' && React.createElement("div", { className: "bg-white shadow rounded-lg" },
        React.createElement("div", { className: "px-3 sm:px-4 py-4 sm:py-5 sm:p-6" },
          React.createElement("h3", { className: "text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" }, "All Announcements"),
          React.createElement("div", { className: "space-y-3 sm:space-y-4" },
            announcements.map((announcement) =>
              React.createElement("div", { key: announcement.id, className: "border-l-4 border-blue-400 bg-blue-50 p-3 sm:p-4 rounded" },
                React.createElement("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2" },
                  React.createElement("h4", { className: "text-sm sm:text-md font-medium text-gray-900 mb-1 sm:mb-0" }, announcement.title),
                  React.createElement("span", {
                    className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`
                  }, announcement.priority)
                ),
                React.createElement("p", { className: "text-xs sm:text-sm text-gray-600 mb-2" }, announcement.message),
                React.createElement("p", { className: "text-xs text-gray-500" },
                  new Date(announcement.created_at).toLocaleDateString()
                )
              )
            ),
            announcements.length === 0 &&
              React.createElement("p", { className: "text-center text-gray-500 py-8" }, "No announcements available.")
          )
        )
      )
    )
  );
};

export default ParticipantDashboard;