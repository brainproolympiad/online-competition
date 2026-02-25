import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ParticipantsTable.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

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
  const [loadingPictures, setLoadingPictures] = useState(true);

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
      if (!filteredParticipants.length) {
        setLoadingPictures(false);
        return;
      }

      try {
        setLoadingPictures(true);
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
      } finally {
        setLoadingPictures(false);
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

  // Check if participant has profile picture
  const hasProfilePicture = (participantId) => {
    return !!profilePictures[participantId];
  };

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

  // Calculate total score
  const calculateTotalScore = (participant) => {
    if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
      return 0;
    }
    
    return participant.quizAttempts.reduce((total, attempt) => {
      const score = attempt.score || attempt.percentage || 0;
      const numericScore = Number(score) || 0;
      return total + numericScore;
    }, 0);
  };

  // Calculate average score percentage
  const calculateAverageScore = (participant) => {
    if (!participant.quizAttempts || participant.quizAttempts.length === 0) {
      return 0;
    }
    
    const totalScore = calculateTotalScore(participant);
    const totalPossible = participant.quizAttempts.length * 100;
    
    return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  };

  // Get performance text
  const getPerformanceText = (percentage) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Help";
  };

  // Get performance badge color
  const getPerformanceBadgeColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    if (percentage >= 40) return "bg-blue-100 text-blue-800";
    return "bg-red-100 text-red-800";
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
      className: "text-center py-12 bg-white rounded-lg border", 
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
    className: "bg-white rounded-lg border shadow-sm", 
    children: [
      _jsx("div", { 
        className: "px-6 py-4 bg-gray-50 border-b", 
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
                      children: "Total: " 
                    }),
                    _jsx("span", { 
                      className: "font-semibold", 
                      children: filteredParticipants.length 
                    })
                  ] 
                }),
                _jsxs("div", { 
                  children: [
                    _jsx("span", { 
                      className: "text-sm text-gray-600", 
                      children: "Selected: " 
                    }),
                    _jsx("span", { 
                      className: "font-semibold text-blue-600", 
                      children: selectedParticipants.size 
                    })
                  ] 
                }),
                _jsxs("div", { 
                  children: [
                    _jsx("span", { 
                      className: "text-sm text-gray-600", 
                      children: "With Profile: " 
                    }),
                    _jsx("span", { 
                      className: "font-semibold text-green-600", 
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
                  children: "Total Attempts: " 
                }),
                _jsx("span", { 
                  className: "font-semibold", 
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
          className: "min-w-full divide-y divide-gray-200", 
          children: [
            _jsx("thead", { 
              className: "bg-gray-50", 
              children: _jsxs("tr", { 
                children: [
                  _jsx("th", { 
                    className: "w-12 px-6 py-3 text-left", 
                    children: _jsx("input", { 
                      type: "checkbox", 
                      checked: selectedParticipants.size === filteredParticipants.length && filteredParticipants.length > 0, 
                      onChange: toggleSelectAll, 
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
                    children: "Actions" 
                  })
                ] 
              })
            }),
            
            _jsx("tbody", { 
              className: "bg-white divide-y divide-gray-200", 
              children: filteredParticipants.map((participant) => {
                const quizAttempts = participant.quizAttempts || [];
                const totalScore = calculateTotalScore(participant);
                const averageScore = calculateAverageScore(participant);
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
                      children: _jsx("input", { 
                        type: "checkbox", 
                        checked: selectedParticipants.has(participant.id), 
                        onChange: () => toggleParticipantSelection(participant.id), 
                        className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      })
                    }),
                    
                    _jsx("td", { 
                      className: "px-6 py-4 whitespace-nowrap", 
                      children: _jsxs("div", { 
                        className: "flex items-center", 
                        children: [
                          _jsxs("div", { 
                            className: "relative flex-shrink-0 mr-3",
                            children: [
                              _jsx("img", {
                                src: profilePictureUrl,
                                alt: participant.fullName,
                                className: "w-10 h-10 rounded-full border border-gray-300 object-cover",
                                onError: (e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.fullName)}&background=random&size=128&bold=true&color=fff`;
                                }
                              }),
                              hasProfile && _jsx("span", { 
                                className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" 
                              })
                            ]
                          }),
                          _jsxs("div", { 
                            children: [
                              _jsx("div", { 
                                className: "text-sm font-medium text-gray-900", 
                                children: participant.fullName 
                              }),
                              _jsx("div", { 
                                className: "text-sm text-gray-500", 
                                children: participant.email 
                              }),
                              _jsxs("div", { 
                                className: "text-xs text-gray-400 mt-1", 
                                children: [
                                  "ID: ",
                                  participant.id.substring(0, 8),
                                  "..."
                                ] 
                              })
                            ] 
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
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
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
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
                            className: `font-medium ${averageScore >= 80 ? 'text-green-600' : averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`, 
                            children: [averageScore, "%"] 
                          }),
                          _jsxs("div", { 
                            className: "text-xs text-gray-500", 
                            children: ["out of ", quizAttempts.length, " quizzes"] 
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
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
                          })
                        ] 
                      })
                    }),
                    
                    _jsx("td", { 
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
        className: "px-6 py-3 bg-gray-50 border-t border-gray-200", 
        children: _jsxs("div", { 
          className: "flex items-center justify-between text-sm text-gray-600", 
          children: [
            _jsxs("div", { 
              children: [
                "Showing ",
                _jsx("span", { 
                  className: "font-medium", 
                  children: filteredParticipants.length 
                }),
                " of ",
                _jsx("span", { 
                  className: "font-medium", 
                  children: filteredParticipants.length 
                }),
                " participants"
              ] 
            }),
            _jsxs("div", { 
              children: [
                _jsx("span", { 
                  className: "font-medium text-green-600", 
                  children: Object.keys(profilePictures).length 
                }),
                " have profile pictures"
              ] 
            })
          ] 
        })
      })
    ] 
  });
};

export default ParticipantsTable;