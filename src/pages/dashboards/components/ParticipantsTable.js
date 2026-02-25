import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ParticipantsTable.tsx
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { supabase } from "../../../supabaseClient";
=======
import { supabase } from "../../../supabaseClient"; // Adjust path as needed
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0

const ParticipantsTable = ({ 
  loading, 
  filteredParticipants, 
  selectedParticipants, 
  toggleParticipantSelection, 
  toggleSelectAll, 
  deleteParticipant, 
  openEditModal, 
  openViewModal 
}) => {
  const [profilePictures, setProfilePictures] = useState({});
<<<<<<< HEAD
  const [loadingPictures, setLoadingPictures] = useState(true);
=======
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0

  // Safe handler functions
  const handleView = (participant) => {
    openViewModal?.(participant);
  };

  const handleEdit = (participant) => {
    openEditModal?.(participant);
  };

  const handleDelete = (id) => {
    if (deleteParticipant) {
      deleteParticipant(id);
    }
  };

  // Fetch profile pictures for all participants
  useEffect(() => {
    const fetchProfilePictures = async () => {
<<<<<<< HEAD
      if (!filteredParticipants.length) {
        setLoadingPictures(false);
        return;
      }

      try {
        setLoadingPictures(true);
=======
      if (!filteredParticipants.length) return;

      try {
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
        const participantIds = filteredParticipants.map(p => p.id);
        
        const { data, error } = await supabase
          .from("profile_pictures")
          .select("participant_id, avatar_url")
          .in("participant_id", participantIds);

        if (error) {
          console.error("Error fetching profile pictures:", error);
          return;
        }

        // Create a map of participant_id -> avatar_url
        const picturesMap = {};
        data?.forEach(item => {
          picturesMap[item.participant_id] = item.avatar_url;
        });

        setProfilePictures(picturesMap);
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
<<<<<<< HEAD
      } finally {
        setLoadingPictures(false);
=======
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
      }
    };

    fetchProfilePictures();
  }, [filteredParticipants]);

  // Get profile picture URL for a participant
  const getProfilePictureUrl = (participantId, fullName) => {
    const avatarUrl = profilePictures[participantId];
    
    if (avatarUrl) {
      return avatarUrl;
    }
    
    // Fallback to avatar generator
    const nameForAvatar = fullName || "Student";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=random&size=128&bold=true&color=fff`;
  };

<<<<<<< HEAD
  // Check if participant has profile picture
  const hasProfilePicture = (participantId) => {
    return !!profilePictures[participantId];
  };

=======
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
  // Format courses display
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

<<<<<<< HEAD
  // Calculate total score
=======
  // Calculate total score from quiz attempts - FIXED
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
  const calculateTotalScore = (participant) => {
    if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
      return 0;
    }
    
    return participant.quizAttempts.reduce((total, attempt) => {
<<<<<<< HEAD
=======
      // FIX: Convert score to number before adding
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
      const score = attempt.score || attempt.percentage || 0;
      const numericScore = Number(score) || 0;
      return total + numericScore;
    }, 0);
  };

<<<<<<< HEAD
  // Calculate average score percentage
=======
  // Calculate average score percentage - FIXED
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
  const calculateAverageScore = (participant) => {
    if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
      return 0;
    }
    
    const totalScore = calculateTotalScore(participant);
<<<<<<< HEAD
=======
    
    // FIX: Each quiz is worth 100 marks, not total_questions
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
    const totalPossible = participant.quizAttempts.length * 100;
    
    return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  };

<<<<<<< HEAD
=======
  // Alternative: Calculate average from individual quiz percentages
  const calculateAverageScoreAlternative = (participant) => {
    if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
      return 0;
    }
    
    let totalPercentage = 0;
    let validAttempts = 0;
    
    participant.quizAttempts.forEach(attempt => {
      // Try to get percentage from different sources
      let percentage = 0;
      
      // Option 1: Use percentage field if available
      if (attempt.percentage !== undefined && attempt.percentage !== null) {
        percentage = Number(attempt.percentage) || 0;
      }
      // Option 2: Calculate from score field if it's a percentage
      else if (attempt.score !== undefined && attempt.score !== null) {
        const score = Number(attempt.score) || 0;
        // If score is <= 100, use it as percentage
        percentage = score <= 100 ? score : Math.round((score / 100) * 100);
      }
      // Option 3: Calculate from correct answers
      else if (attempt.correct_answers !== undefined && attempt.total_questions !== undefined) {
        const correct = Number(attempt.correct_answers) || 0;
        const total = Number(attempt.total_questions) || 0;
        percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
      }
      
      if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
        totalPercentage += percentage;
        validAttempts++;
      }
    });
    
    return validAttempts > 0 ? Math.round(totalPercentage / validAttempts) : 0;
  };

  // Get score color based on average percentage
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // Get performance badge color
  const getPerformanceBadgeColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
  // Get performance text
  const getPerformanceText = (percentage) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Help";
  };

<<<<<<< HEAD
  // Get performance badge color
  const getPerformanceBadgeColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    if (percentage >= 40) return "bg-blue-100 text-blue-800";
    return "bg-red-100 text-red-800";
=======
  // Get profile picture indicator
  const getProfilePictureIndicator = (participantId) => {
    return profilePictures[participantId] ? (
      _jsx("span", { 
        className: "absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white",
        title: "Profile picture uploaded"
      })
    ) : (
      _jsx("span", { 
        className: "absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white",
        title: "No profile picture"
      })
    );
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
  };

  if (loading) {
    return _jsxs("div", { 
      className: "flex justify-center items-center py-12", 
      children: [
        _jsx("div", { 
          className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" 
        }),
        _jsx("span", { 
          className: "ml-3 text-gray-600", 
          children: "Loading participants..." 
        })
      ] 
    });
  }

  if (filteredParticipants.length === 0) {
    return _jsxs("div", { 
<<<<<<< HEAD
      className: "text-center py-12 bg-white rounded-lg border", 
=======
      className: "text-center py-12 bg-white rounded-lg border border-gray-200", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
      children: [
        _jsx("div", { 
          className: "text-gray-400 text-4xl mb-3", 
          children: "📊" 
        }),
        _jsx("div", { 
          className: "text-gray-500 text-lg font-medium", 
          children: "No participants found" 
        }),
        _jsx("div", { 
          className: "text-gray-400 text-sm", 
          children: "Try adjusting your search criteria" 
        })
      ] 
    });
  }

  return _jsxs("div", { 
<<<<<<< HEAD
    className: "bg-white rounded-lg border shadow-sm", 
    children: [
      _jsx("div", { 
        className: "px-6 py-4 bg-gray-50 border-b", 
=======
    className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", 
    children: [
      _jsx("div", { 
        className: "px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
        children: _jsxs("div", { 
          className: "flex items-center justify-between", 
          children: [
            _jsxs("div", { 
              className: "flex items-center space-x-6", 
              children: [
                _jsxs("div", { 
                  children: [
                    _jsx("span", { 
                      className: "text-sm text-gray-600", 
<<<<<<< HEAD
                      children: "Total: " 
                    }),
                    _jsx("span", { 
                      className: "font-semibold", 
=======
                      children: "Total Participants:" 
                    }),
                    _jsx("span", { 
                      className: "ml-2 text-lg font-semibold text-gray-900", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                      children: filteredParticipants.length 
                    })
                  ] 
                }),
                _jsxs("div", { 
                  children: [
                    _jsx("span", { 
                      className: "text-sm text-gray-600", 
<<<<<<< HEAD
                      children: "Selected: " 
                    }),
                    _jsx("span", { 
                      className: "font-semibold text-blue-600", 
=======
                      children: "Selected:" 
                    }),
                    _jsx("span", { 
                      className: "ml-2 text-lg font-semibold text-blue-600", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                      children: selectedParticipants.size 
                    })
                  ] 
                }),
                _jsxs("div", { 
                  children: [
                    _jsx("span", { 
                      className: "text-sm text-gray-600", 
<<<<<<< HEAD
                      children: "With Profile: " 
                    }),
                    _jsx("span", { 
                      className: "font-semibold text-green-600", 
=======
                      children: "With Profile Pic:" 
                    }),
                    _jsx("span", { 
                      className: "ml-2 text-lg font-semibold text-green-600", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                      children: Object.keys(profilePictures).length 
                    })
                  ] 
                })
              ] 
            }),
            _jsxs("div", { 
              className: "text-right", 
              children: [
                _jsx("span", { 
                  className: "text-sm text-gray-600", 
<<<<<<< HEAD
                  children: "Total Attempts: " 
                }),
                _jsx("span", { 
                  className: "font-semibold", 
=======
                  children: "Total Attempts:" 
                }),
                _jsx("span", { 
                  className: "ml-2 text-lg font-semibold text-green-600", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                  children: filteredParticipants.reduce((acc, p) => acc + (p.quizAttempts?.length || 0), 0) 
                })
              ] 
            })
          ] 
        })
      }),
      
      _jsx("div", { 
        className: "overflow-x-auto", 
        children: _jsxs("table", { 
<<<<<<< HEAD
          className: "min-w-full divide-y divide-gray-200", 
          children: [
            _jsx("thead", { 
              className: "bg-gray-50", 
              children: _jsxs("tr", { 
                children: [
                  _jsx("th", { 
                    className: "w-12 px-6 py-3 text-left", 
=======
          className: "min-w-full", 
          children: [
            _jsx("thead", { 
              className: "bg-gray-50/80", 
              children: _jsxs("tr", { 
                children: [
                  _jsx("th", { 
                    className: "w-12 px-6 py-4", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                    children: _jsx("input", { 
                      type: "checkbox", 
                      checked: selectedParticipants.size === filteredParticipants.length && filteredParticipants.length > 0, 
                      onChange: toggleSelectAll, 
<<<<<<< HEAD
                      className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    })
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
                    children: "Participant" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
                    children: "Class" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
                    children: "Courses" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
                    children: "Quizzes" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
                    children: "Total Score" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
                    children: "Average %" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
                    children: "Performance" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", 
=======
                      className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    })
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
                    children: "Participant" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
                    children: "Profile Picture" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
                    children: "Class & Courses" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
                    children: "Quiz Attempts" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
                    children: "Total Score" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
                    children: "Average" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
                    children: "Performance" 
                  }),
                  _jsx("th", { 
                    className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                    children: "Actions" 
                  })
                ] 
              })
            }),
            
            _jsx("tbody", { 
<<<<<<< HEAD
              className: "bg-white divide-y divide-gray-200", 
=======
              className: "divide-y divide-gray-200", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
              children: filteredParticipants.map((participant) => {
                const quizAttempts = participant.quizAttempts || [];
                const totalScore = calculateTotalScore(participant);
                const averageScore = calculateAverageScore(participant);
<<<<<<< HEAD
                const performanceText = getPerformanceText(averageScore);
                const performanceBadgeColor = getPerformanceBadgeColor(averageScore);
                const coursesArray = formatCourses(participant.courses);
                const profilePictureUrl = getProfilePictureUrl(participant.id, participant.fullName);
                const hasProfile = hasProfilePicture(participant.id);

                return _jsxs("tr", { 
                  className: "hover:bg-gray-50", 
                  children: [
                    _jsx("td", { 
                      className: "px-6 py-4 whitespace-nowrap", 
=======
                const scoreColor = getScoreColor(averageScore);
                const performanceBadgeColor = getPerformanceBadgeColor(averageScore);
                const performanceText = getPerformanceText(averageScore);
                const coursesArray = formatCourses(participant.courses);
                const profilePictureUrl = getProfilePictureUrl(participant.id, participant.fullName);
                const hasProfilePicture = !!profilePictures[participant.id];

                return _jsxs("tr", { 
                  className: "hover:bg-blue-50/30 transition-colors duration-150", 
                  children: [
                    _jsx("td", { 
                      className: "px-6 py-4", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                      children: _jsx("input", { 
                        type: "checkbox", 
                        checked: selectedParticipants.has(participant.id), 
                        onChange: () => toggleParticipantSelection(participant.id), 
<<<<<<< HEAD
                        className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
=======
                        className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                      })
                    }),
                    
                    _jsx("td", { 
<<<<<<< HEAD
                      className: "px-6 py-4 whitespace-nowrap", 
                      children: _jsxs("div", { 
                        className: "flex items-center", 
                        children: [
                          _jsxs("div", { 
                            className: "relative flex-shrink-0 mr-3",
=======
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "flex items-center space-x-3", 
                        children: [
                          _jsx("div", { 
                            className: "relative flex-shrink-0",
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                            children: [
                              _jsx("img", {
                                src: profilePictureUrl,
                                alt: participant.fullName,
<<<<<<< HEAD
                                className: "w-10 h-10 rounded-full border border-gray-300 object-cover",
                                onError: (e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.fullName)}&background=random&size=128&bold=true&color=fff`;
                                }
                              }),
                              hasProfile && _jsx("span", { 
                                className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" 
                              })
=======
                                className: "w-10 h-10 rounded-full object-cover border-2 border-blue-200",
                                onError: (e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.fullName)}&background=random&size=128&bold=true&color=fff`;
                                }
                              }),
                              getProfilePictureIndicator(participant.id)
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                            ]
                          }),
                          _jsxs("div", { 
                            children: [
                              _jsx("div", { 
<<<<<<< HEAD
                                className: "text-sm font-medium text-gray-900", 
=======
                                className: "text-sm font-semibold text-gray-900", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                                children: participant.fullName 
                              }),
                              _jsx("div", { 
                                className: "text-sm text-gray-500", 
                                children: participant.email 
<<<<<<< HEAD
                              }),
                              _jsxs("div", { 
                                className: "text-xs text-gray-400 mt-1", 
                                children: [
                                  "ID: ",
                                  participant.id.substring(0, 8),
                                  "..."
                                ] 
=======
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                              })
                            ] 
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
<<<<<<< HEAD
                      className: "px-6 py-4 whitespace-nowrap", 
                      children: _jsxs("div", { 
                        className: "text-sm text-gray-900", 
                        children: [
                          _jsx("span", { 
                            className: "inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800", 
                            children: participant.classLevel 
                          }),
                          _jsxs("div", { 
                            className: "mt-1 text-xs text-gray-500", 
                            children: [
                              hasProfile ? "Profile: ✅" : "Profile: ❌"
                            ] 
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "text-sm text-gray-900", 
                        children: [
                          _jsx("div", { 
                            className: "mb-1", 
                            children: coursesArray.slice(0, 2).join(", ") 
                          }),
                          coursesArray.length > 2 && _jsxs("span", { 
                            className: "text-xs text-blue-600", 
                            children: ["+", coursesArray.length - 2, " more"] 
=======
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "flex flex-col items-start space-y-2", 
                        children: [
                          _jsxs("span", { 
                            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${hasProfilePicture ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`, 
                            children: [
                              _jsx("svg", { 
                                className: `w-3 h-3 mr-1 ${hasProfilePicture ? 'text-green-600' : 'text-yellow-600'}`, 
                                fill: "none", 
                                stroke: "currentColor", 
                                viewBox: "0 0 24 24", 
                                children: hasProfilePicture ? 
                                  _jsx("path", { 
                                    strokeLinecap: "round", 
                                    strokeLinejoin: "round", 
                                    strokeWidth: "2", 
                                    d: "M5 13l4 4L19 7" 
                                  }) :
                                  _jsx("path", { 
                                    strokeLinecap: "round", 
                                    strokeLinejoin: "round", 
                                    strokeWidth: "2", 
                                    d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                  })
                              }),
                              hasProfilePicture ? "Uploaded" : "No Picture"
                            ] 
                          }),
                          _jsx("div", { 
                            className: "text-xs text-gray-500", 
                            children: `ID: ${participant.id.substring(0, 8)}...` 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
<<<<<<< HEAD
                      className: "px-6 py-4 whitespace-nowrap", 
                      children: _jsxs("div", { 
                        className: "text-sm text-gray-900", 
                        children: [
                          _jsxs("div", { 
                            className: "font-medium", 
                            children: [quizAttempts.length, " attempts"] 
                          }),
                          quizAttempts.length > 0 && _jsxs("div", { 
                            className: "text-xs text-gray-500", 
                            children: ["Last: ", new Date(quizAttempts[0].submitted_at || quizAttempts[0].completed_at).toLocaleDateString()] 
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
                      className: "px-6 py-4 whitespace-nowrap", 
                      children: _jsxs("div", { 
                        className: "text-sm", 
                        children: [
                          _jsxs("div", { 
                            className: "font-medium text-gray-900", 
                            children: [totalScore, " points"] 
                          }),
                          _jsxs("div", { 
                            className: "text-xs text-gray-500", 
                            children: ["Max: ", quizAttempts.length * 100] 
=======
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "space-y-2", 
                        children: [
                          _jsx("span", { 
                            className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200", 
                            children: participant.classLevel 
                          }),
                          _jsxs("div", { 
                            className: "text-xs text-gray-600 max-w-xs", 
                            children: [
                              coursesArray.slice(0, 2).join(", "),
                              coursesArray.length > 2 && _jsxs("span", { 
                                className: "text-blue-600 ml-1", 
                                children: ["+", coursesArray.length - 2, " more"] 
                              })
                            ] 
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "space-y-1", 
                        children: [
                          _jsxs("div", { 
                            className: "flex items-center space-x-2", 
                            children: [
                              _jsx("span", { 
                                className: "text-lg font-bold text-gray-900", 
                                children: quizAttempts.length 
                              }),
                              _jsx("span", { 
                                className: "text-sm text-gray-500", 
                                children: "attempts" 
                              })
                            ] 
                          }),
                          quizAttempts.length > 0 && _jsxs("div", { 
                            className: "text-xs text-gray-500", 
                            children: ["Latest: ", new Date(quizAttempts[0].submitted_at || quizAttempts[0].completed_at).toLocaleDateString()] 
                          }),
                          quizAttempts.some(attempt => attempt.cheat_attempts > 0) && _jsxs("div", { 
                            className: "text-xs text-red-600 font-medium flex items-center", 
                            children: [
                              _jsx("span", { 
                                className: "w-2 h-2 bg-red-500 rounded-full mr-1" 
                              }),
                              "Cheat detected"
                            ] 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
<<<<<<< HEAD
                      className: "px-6 py-4 whitespace-nowrap", 
                      children: _jsxs("div", { 
                        className: "text-sm", 
                        children: [
                          _jsxs("div", { 
                            className: `font-medium ${averageScore >= 80 ? 'text-green-600' : averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`, 
                            children: [averageScore, "%"] 
                          }),
                          _jsxs("div", { 
                            className: "text-xs text-gray-500", 
                            children: ["out of ", quizAttempts.length, " quizzes"] 
=======
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "text-center p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200", 
                        children: [
                          _jsx("div", { 
                            className: "text-2xl font-bold text-gray-900", 
                            children: totalScore 
                          }),
                          _jsx("div", { 
                            className: "text-xs text-gray-500 mt-1", 
                            children: "points" 
                          }),
                          _jsx("div", { 
                            className: "text-xs text-blue-600 mt-1", 
                            children: `(${totalScore}/${quizAttempts.length * 100} total)` 
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: `text-center p-3 rounded-lg border ${scoreColor} border-current`, 
                        children: [
                          _jsxs("div", { 
                            className: "text-2xl font-bold", 
                            children: [averageScore, "%"] 
                          }),
                          _jsx("div", { 
                            className: "text-xs opacity-75 mt-1", 
                            children: "average" 
                          }),
                          _jsx("div", { 
                            className: "text-xs opacity-75 mt-1", 
                            children: `(${quizAttempts.length} quizzes)` 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
<<<<<<< HEAD
                      className: "px-6 py-4 whitespace-nowrap", 
                      children: _jsxs("div", { 
                        className: "flex items-center space-x-2", 
                        children: [
                          _jsx("span", { 
                            className: `px-2 py-1 text-xs font-medium rounded ${performanceBadgeColor}`, 
                            children: performanceText 
                          }),
                          _jsx("div", { 
                            className: "w-16 bg-gray-200 rounded-full h-1.5", 
                            children: _jsx("div", { 
                              className: `h-1.5 rounded-full ${averageScore >= 80 ? 'bg-green-500' : averageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`, 
                              style: { width: `${Math.min(averageScore, 100)}%` } 
                            })
=======
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "flex flex-col items-start space-y-2", 
                        children: [
                          _jsx("span", { 
                            className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${performanceBadgeColor} border`, 
                            children: performanceText 
                          }),
                          _jsx("div", { 
                            className: "w-20 bg-gray-200 rounded-full h-2", 
                            children: _jsx("div", { 
                              className: "bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500", 
                              style: { width: `${Math.min(averageScore, 100)}%` } 
                            })
                          }),
                          _jsx("div", { 
                            className: "text-xs text-gray-500", 
                            children: `${quizAttempts.length} completed` 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
<<<<<<< HEAD
                      className: "px-6 py-4 whitespace-nowrap text-sm font-medium", 
                      children: _jsxs("div", { 
                        className: "flex space-x-2", 
                        children: [
                          _jsx("button", { 
                            onClick: () => handleView(participant), 
                            className: "px-3 py-1 text-xs bg-green-100 text-green-800 hover:bg-green-200 rounded", 
                            children: "View" 
                          }),
                          _jsx("button", { 
                            onClick: () => handleEdit(participant), 
                            className: "px-3 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded", 
                            children: "Edit" 
                          }),
                          _jsx("button", { 
                            onClick: () => handleDelete(participant.id), 
                            className: "px-3 py-1 text-xs bg-red-100 text-red-800 hover:bg-red-200 rounded", 
                            children: "Delete" 
=======
                      className: "px-6 py-4", 
                      children: _jsxs("div", { 
                        className: "flex items-center space-x-2", 
                        children: [
                          _jsx("button", { 
                            onClick: () => handleView(participant), 
                            className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors", 
                            children: _jsx("span", { children: "View" }) 
                          }),
                          _jsx("button", { 
                            onClick: () => handleEdit(participant), 
                            className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors", 
                            children: _jsx("span", { children: "Edit" }) 
                          }),
                          _jsx("button", { 
                            onClick: () => handleDelete(participant.id), 
                            className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors", 
                            children: _jsx("span", { children: "Delete" }) 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                          })
                        ] 
                      })
                    })
                  ] 
                }, participant.id);
              })
            })
          ] 
        })
      }),
      
      _jsx("div", { 
<<<<<<< HEAD
        className: "px-6 py-3 bg-gray-50 border-t border-gray-200", 
=======
        className: "px-6 py-4 bg-gray-50 border-t border-gray-200", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
        children: _jsxs("div", { 
          className: "flex items-center justify-between text-sm text-gray-600", 
          children: [
            _jsxs("div", { 
              children: [
                "Showing ",
                _jsx("span", { 
<<<<<<< HEAD
                  className: "font-medium", 
                  children: filteredParticipants.length 
                }),
                " of ",
                _jsx("span", { 
                  className: "font-medium", 
=======
                  className: "font-semibold", 
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
                  children: filteredParticipants.length 
                }),
                " participants"
              ] 
            }),
            _jsxs("div", { 
              children: [
                _jsx("span", { 
<<<<<<< HEAD
                  className: "font-medium text-green-600", 
                  children: Object.keys(profilePictures).length 
                }),
                " have profile pictures"
=======
                  className: "font-semibold text-green-600", 
                  children: Object.keys(profilePictures).length 
                }),
                " with profile pictures"
>>>>>>> 1b938d9b81fbe733363e8487d48afe673d720cd0
              ] 
            })
          ] 
        })
      })
    ] 
  });
};

export default ParticipantsTable;