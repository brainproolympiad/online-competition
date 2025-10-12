// src/pages/dashboards/AdminDashboard.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "../../../supabaseClient";
import Swal from "sweetalert2";
import AdminContentManager from "./AdminContentManager";

// Components
import AdminHeader from "../components/AdminHeader";
import DebugPanel from "../components/DebugPanel";
import ChartsSection from "../components/ChartsSection";
import StatisticsCards from "../components/StatisticsCard";
import AccountingSection from "../components/AccountingSection";
import FiltersSection from "../components/FiltersSection";
import BulkActions from "../components/BulkActions";
import ParticipantsTable from "../components/ParticipantsTable";
import QuizManagement from "../components/QuizManagement";
import ResourceManagement from "../components/ResourceManagement";
import AnnouncementManagement from "../components/AnnouncementManagement";
import ViewParticipantModel from "../components/ViewParticipantModel";
import EditParticipantModal from "../components/EditParticipantModal";
import CapturesButton from "../components/CapturesButton";

// Types
import type { 
  Participant, 
  ParticipantRaw, 
  Filters, 
  DebugInfo, 
  QuizInfo, 
  Resource, 
  Announcement,
  QuizAttempt 
} from "../types/adminTypes";

// Utilities
import { normalizeCourses, normalizeScores, saveToLocalStorage, LOCAL_STORAGE_KEYS } from "../utils/adminUtils";

interface AdminSettings {
  lastUsedFilters?: Filters;
  defaultQuizDuration?: number;
  defaultQuizQuestions?: number;
}

const AdminDashboard: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [quizzes, setQuizzes] = useState<QuizInfo[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    classLevel: "",
    course: "",
    paymentStatus: "",
    hasQuizLink: ""
  });
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [debugLog, setDebugLog] = useState<DebugInfo[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({});
  const [quizLinkUpdates, setQuizLinkUpdates] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('participants');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // --- DEBUG LOGGING ---
  const addDebugLog = useCallback((action: string, participantId?: string, data?: any, error?: string) => {
    const log: DebugInfo = {
      action,
      timestamp: new Date().toISOString(),
      participantId,
      data,
      error
    };
    setDebugLog(prev => [log, ...prev.slice(0, 49)]);
    console.log(`[DEBUG] ${action}:`, { participantId, data, error });
  }, []);

  // --- CALCULATE SUBJECT SCORES FROM QUIZ ATTEMPTS ---
  const calculateSubjectScores = useCallback((attempts: QuizAttempt[]) => {
    const subjectScores: { [subject: string]: { score: number; totalQuestions: number; percentage: number; attempts: number } } = {};
    
    attempts.forEach(attempt => {
      const subject = attempt.quizzes?.subject || 'Unknown Subject';
      
      if (!subjectScores[subject]) {
        subjectScores[subject] = {
          score: 0,
          totalQuestions: 0,
          percentage: 0,
          attempts: 0
        };
      }
      
      subjectScores[subject].score += attempt.score;
      subjectScores[subject].totalQuestions += attempt.total_questions;
      subjectScores[subject].attempts += 1;
    });
    
    // Calculate percentages
    Object.keys(subjectScores).forEach(subject => {
      const subjectData = subjectScores[subject];
      subjectData.percentage = subjectData.totalQuestions > 0 
        ? Math.round((subjectData.score / subjectData.totalQuestions) * 100) 
        : 0;
    });
    
    return subjectScores;
  }, []);

  // --- FETCH QUIZ ATTEMPTS FOR PARTICIPANTS ---
  const fetchQuizAttemptsForParticipants = useCallback(async (participantIds: string[]) => {
    try {
      if (participantIds.length === 0) return {};

      const { data, error } = await supabase
        .from('quiz_attempts')
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
        .in('participant_id', participantIds)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Ensure photo_data is always an array
      const attemptsWithPhotos = data?.map(attempt => ({
        ...attempt,
        photo_data: Array.isArray(attempt.photo_data) ? attempt.photo_data : []
      })) || [];
      
      // Group quiz attempts by participant_id
      const attemptsByParticipant: Record<string, QuizAttempt[]> = {};
      attemptsWithPhotos.forEach(attempt => {
        if (!attemptsByParticipant[attempt.participant_id]) {
          attemptsByParticipant[attempt.participant_id] = [];
        }
        attemptsByParticipant[attempt.participant_id].push(attempt);
      });
      
      return attemptsByParticipant;
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      return {};
    }
  }, []);

  // --- EXPORT QUIZ RESULTS ---
  const exportQuizResults = useCallback(async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      addDebugLog("EXPORT_QUIZ_RESULTS_ATTEMPT", undefined, { format });
      
      // Fetch all quiz attempts with participant details
      const { data: attemptsData, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (title, subject, description),
          registrations (fullName, email, classLevel, phone, state, lga, schoolName)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      if (!attemptsData || attemptsData.length === 0) {
        Swal.fire("Info", "No quiz results to export", "info");
        return;
      }

      // Prepare data for export
      const exportData = attemptsData.map(attempt => ({
        'Participant Name': attempt.registrations?.fullName || 'Unknown',
        'Email': attempt.registrations?.email || 'N/A',
        'Class Level': attempt.registrations?.classLevel || 'N/A',
        'Phone': attempt.registrations?.phone || 'N/A',
        'State': attempt.registrations?.state || 'N/A',
        'LGA': attempt.registrations?.lga || 'N/A',
        'School': attempt.registrations?.schoolName || 'N/A',
        'Quiz Title': attempt.quizzes?.title || 'Unknown Quiz',
        'Subject': attempt.quizzes?.subject || 'Unknown',
        'Score': attempt.score,
        'Total Questions': attempt.total_questions,
        'Percentage': attempt.total_questions > 0 ? Math.round((attempt.score / attempt.total_questions) * 100) : 0,
        'Correct Answers': attempt.correct_answers,
        'Status': attempt.status,
        'Warnings': attempt.warnings || 0,
        'Time Spent (seconds)': attempt.duration_seconds || attempt.time_spent || 0,
        'Submitted At': attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : 'Not submitted',
        'Attempt ID': attempt.id
      }));

      // For now, we'll create a CSV export
      if (format === 'csv') {
        const headers = Object.keys(exportData[0]).join(',');
        const csvContent = exportData.map(row => 
          Object.values(row).map(field => 
            `"${String(field).replace(/"/g, '""')}"`
          ).join(',')
        ).join('\n');
        
        const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        Swal.fire("Info", `${format.toUpperCase()} export will be implemented with proper libraries`, "info");
      }

      addDebugLog("EXPORT_QUIZ_RESULTS_SUCCESS", undefined, { count: exportData.length, format });
      Swal.fire("Success", `Quiz results exported as ${format.toUpperCase()}`, "success");
    } catch (error: any) {
      addDebugLog("EXPORT_QUIZ_RESULTS_ERROR", undefined, undefined, error.message);
      Swal.fire("Error", "Failed to export quiz results", "error");
    }
  }, [addDebugLog]);

  // --- LOAD FROM LOCAL STORAGE ---
  useEffect(() => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_SETTINGS);
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAdminSettings(settings);
        if (settings.lastUsedFilters) {
          setFilters(settings.lastUsedFilters);
        }
      } catch (error) {
        console.error('Error loading admin settings:', error);
      }
    }

    const cachedParticipants = localStorage.getItem(LOCAL_STORAGE_KEYS.PARTICIPANTS_CACHE);
    const lastFetchTime = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_FETCH_TIME);
    
    if (cachedParticipants && lastFetchTime) {
      const cacheAge = Date.now() - parseInt(lastFetchTime);
      if (cacheAge < 5 * 60 * 1000) {
        try {
          const parsedParticipants = JSON.parse(cachedParticipants);
          setParticipants(parsedParticipants);
          setLoading(false);
          addDebugLog("LOAD_FROM_CACHE", undefined, { count: parsedParticipants.length, cacheAge: `${Math.round(cacheAge/1000)}s` });
        } catch (error) {
          console.error('Error loading cached participants:', error);
        }
      }
    }

    // Fetch all data
    fetchAllData();
  }, []);

  // --- FETCH ALL DATA ---
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchParticipants(),
        fetchQuizzes(),
        fetchResources(),
        fetchAnnouncements(),
        fetchAllQuizAttempts()
      ]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch participants function
  const fetchParticipants = useCallback(async () => {
    try {
      addDebugLog("FETCH_PARTICIPANTS_START");
      
      const { data, error, status } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      addDebugLog("FETCH_PARTICIPANTS_RESPONSE", undefined, { status, count: data?.length });

      if (error) {
        addDebugLog("FETCH_PARTICIPANTS_ERROR", undefined, undefined, error.message);
        throw error;
      }

      // Extract participant IDs to fetch their quiz attempts
      const participantIds = (data as ParticipantRaw[]).map(p => p.id);
      const quizAttemptsByParticipant = await fetchQuizAttemptsForParticipants(participantIds);

      const normalized = (data as ParticipantRaw[]).map((p) => {
        const participantAttempts = quizAttemptsByParticipant[p.id] || [];
        
        // Calculate subject scores from quiz attempts
        const subjectScores = calculateSubjectScores(participantAttempts);
        
        // Calculate total score from ALL quiz attempts (sum of all scores)
        const totalScoreFromAttempts = participantAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
        
        // Calculate average percentage across all attempts
        const totalQuestionsFromAttempts = participantAttempts.reduce((sum, attempt) => sum + attempt.total_questions, 0);
        const averageScoreFromAttempts = totalQuestionsFromAttempts > 0 
          ? Math.round((totalScoreFromAttempts / totalQuestionsFromAttempts) * 100) 
          : 0;

        // For backward compatibility, also check the scores field
        const scores = normalizeScores(p.scores);
        const legacyTotalScore = scores ? Object.values(scores).reduce((sum: number, score: any) => sum + score, 0) : 0;
        
        // Use quiz attempts scores if available, otherwise fall back to legacy scores
        const totalScore = participantAttempts.length > 0 ? totalScoreFromAttempts : legacyTotalScore;
        const averageScore = participantAttempts.length > 0 
          ? averageScoreFromAttempts 
          : (scores && Object.keys(scores).length > 0 ? Math.round(legacyTotalScore / Object.keys(scores).length) : 0);

        return {
          id: p.id,
          fullName: p.fullName || "Unknown",
          email: p.email || "N/A",
          classLevel: p.classLevel || "N/A",
          courses: normalizeCourses(p.courses),
          quizLink: p.quiz_link || null,
          scores: scores,
          paid: p.paid ?? false,
          amountPaid: p.amount_paid || 0,
          createdAt: p.created_at,
          avatarUrl: p.avatar_url,
          totalScore,
          averageScore,
          quizAttempts: participantAttempts,
          subjectScores,
          // Additional registration details
          phone: p.phone,
          gender: p.gender,
          state: p.state,
          lga: p.lga,
          address: p.address,
          schoolName: p.schoolName,
          schoolType: p.schoolType,
          term: p.term,
          username: p.username,
          dob: p.dob,
          favoriteSubject: p.favoriteSubject
        } as Participant;
      });

      setParticipants(normalized);
      
      saveToLocalStorage(LOCAL_STORAGE_KEYS.PARTICIPANTS_CACHE, normalized);
      saveToLocalStorage(LOCAL_STORAGE_KEYS.LAST_FETCH_TIME, Date.now().toString());
      
      addDebugLog("FETCH_PARTICIPANTS_SUCCESS", undefined, { normalizedCount: normalized.length });

    } catch (error: any) {
      console.error("Fetch participants error:", error);
      Swal.fire("Error", "Failed to fetch participants", "error");
    }
  }, [addDebugLog, fetchQuizAttemptsForParticipants, calculateSubjectScores]);

  // --- FETCH ALL QUIZ ATTEMPTS (for quiz results tab) ---
  const fetchAllQuizAttempts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          registrations (fullName, email, classLevel, phone),
          quizzes (title, subject, description)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure photo_data is always an array and fix time spent calculation
      const attemptsWithPhotos = data?.map(attempt => ({
        ...attempt,
        photo_data: Array.isArray(attempt.photo_data) ? attempt.photo_data : [],
        // Calculate time spent properly
        time_spent: attempt.duration_seconds || attempt.time_spent || 0
      })) || [];
      
      setQuizAttempts(attemptsWithPhotos);
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
    }
  }, []);

  // --- FETCH QUIZZES ---
  const fetchQuizzes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  }, []);

  // --- FETCH RESOURCES ---
  const fetchResources = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  }, []);

  // --- FETCH ANNOUNCEMENTS ---
  const fetchAnnouncements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  }, []);

  // --- SAVE FILTERS TO LOCAL STORAGE ---
  useEffect(() => {
    const newSettings = {
      ...adminSettings,
      lastUsedFilters: filters
    };
    setAdminSettings(newSettings);
    saveToLocalStorage(LOCAL_STORAGE_KEYS.ADMIN_SETTINGS, newSettings);
  }, [filters]);

  // --- UPDATE PARTICIPANTS WITH LOCAL STORAGE ---
  const updateParticipants = useCallback((updatedParticipants: Participant[]) => {
    setParticipants(updatedParticipants);
    saveToLocalStorage(LOCAL_STORAGE_KEYS.PARTICIPANTS_CACHE, updatedParticipants);
  }, []);

  // --- MODAL HANDLERS ---
  const openViewModal = useCallback((participant: Participant) => {
    setSelectedParticipant(participant);
    setViewModalOpen(true);
    addDebugLog("OPEN_VIEW_MODAL", participant.id, { name: participant.fullName });
  }, [addDebugLog]);

  const openEditModal = useCallback((participant: Participant) => {
    setSelectedParticipant(participant);
    setEditModalOpen(true);
    addDebugLog("OPEN_EDIT_MODAL", participant.id, { name: participant.fullName });
  }, [addDebugLog]);

  const closeModals = useCallback(() => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedParticipant(null);
    addDebugLog("CLOSE_MODALS");
  }, [addDebugLog]);

  // --- DELETE PARTICIPANT ---
  const deleteParticipant = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) {
      return;
    }

    try {
      addDebugLog("DELETE_PARTICIPANT_ATTEMPT", id);
      
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setParticipants(prev => prev.filter(p => p.id !== id));
      setSelectedParticipants(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(id);
        return newSelected;
      });

      addDebugLog("DELETE_PARTICIPANT_SUCCESS", id);
      Swal.fire("Success", "Participant deleted successfully!", "success");
    } catch (error: any) {
      addDebugLog("DELETE_PARTICIPANT_ERROR", id, undefined, error.message);
      Swal.fire("Error", "Failed to delete participant", "error");
    }
  }, [addDebugLog]);

  // --- UPDATE PARTICIPANT ---
  const updateParticipant = useCallback(async (updatedParticipant: Participant) => {
    try {
      addDebugLog("UPDATE_PARTICIPANT_ATTEMPT", updatedParticipant.id, updatedParticipant);

      // Prepare the update data according to your database schema
      const updateData: any = {
        fullName: updatedParticipant.fullName,
        email: updatedParticipant.email,
        courses: updatedParticipant.courses,
        paid: updatedParticipant.paid,
        amount_paid: updatedParticipant.amountPaid || 0,
        phone: updatedParticipant.phone,
        gender: updatedParticipant.gender,
        state: updatedParticipant.state,
        lga: updatedParticipant.lga,
        address: updatedParticipant.address,
        schoolName: updatedParticipant.schoolName,
        schoolType: updatedParticipant.schoolType,
        term: updatedParticipant.term,
        username: updatedParticipant.username,
        dob: updatedParticipant.dob,
        favoriteSubject: updatedParticipant.favoriteSubject
      };

      // Only add scores if they exist and your database supports it
      if (updatedParticipant.scores && Object.keys(updatedParticipant.scores).length > 0) {
        updateData.scores = updatedParticipant.scores;
      }

      console.log('Update data being sent to database:', updateData);

      const { data, error } = await supabase
        .from("registrations")
        .update(updateData)
        .eq("id", updatedParticipant.id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update local state
      setParticipants(prev => 
        prev.map(p => p.id === updatedParticipant.id ? updatedParticipant : p)
      );

      addDebugLog("UPDATE_PARTICIPANT_SUCCESS", updatedParticipant.id, data);
      Swal.fire("Success", "Participant updated successfully!", "success");
      closeModals();
    } catch (error: any) {
      console.error('Full update error:', error);
      addDebugLog("UPDATE_PARTICIPANT_ERROR", updatedParticipant.id, undefined, error.message);
      
      Swal.fire({
        title: "Update Failed",
        text: `Failed to update participant: ${error.message}`,
        icon: "error"
      });
    }
  }, [addDebugLog, closeModals]);

  // --- QUIZ LINK MANAGEMENT ---
  const handleQuizLinkChange = useCallback((id: string, value: string) => {
    setQuizLinkUpdates(prev => ({ ...prev, [id]: value }));
  }, []);

  const updateQuizLink = useCallback(async (id: string) => {
    const newLink = quizLinkUpdates[id];
    if (!newLink) {
      Swal.fire("Warning", "Please enter a quiz link", "warning");
      return;
    }

    try {
      addDebugLog("UPDATE_QUIZ_LINK_ATTEMPT", id, { newLink });

      const { data, error } = await supabase
        .from("registrations")
        .update({ quiz_link: newLink })
        .eq("id", id)
        .select();

      if (error) throw error;
      
      addDebugLog("UPDATE_QUIZ_LINK_SUCCESS", id, data);

      // Update local state
      setParticipants(prev => prev.map(p => 
        p.id === id ? { ...p, quizLink: newLink } : p
      ));

      // Clear the input for this participant
      setQuizLinkUpdates(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      Swal.fire("Success", "Quiz link updated!", "success");
    } catch (err: any) {
      addDebugLog("UPDATE_QUIZ_LINK_ERROR", id, undefined, err.message);
      Swal.fire("Error", "Failed to update quiz link", "error");
    }
  }, [quizLinkUpdates, addDebugLog]);

  // --- QUIZ MANAGEMENT ---
  const createQuiz = useCallback(async (quizData: Omit<QuizInfo, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .insert([quizData])
        .select()
        .single();

      if (error) throw error;

      setQuizzes(prev => [data, ...prev]);
      Swal.fire("Success", "Quiz created successfully!", "success");
      return data;
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      Swal.fire("Error", "Failed to create quiz", "error");
      throw error;
    }
  }, []);

  const updateQuiz = useCallback(async (id: string, quizData: Partial<QuizInfo>) => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .update(quizData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setQuizzes(prev => prev.map(quiz => quiz.id === id ? data : quiz));
      Swal.fire("Success", "Quiz updated successfully!", "success");
      return data;
    } catch (error: any) {
      console.error("Error updating quiz:", error);
      Swal.fire("Error", "Failed to update quiz", "error");
      throw error;
    }
  }, []);

  const deleteQuiz = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
      Swal.fire("Success", "Quiz deleted successfully!", "success");
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
      Swal.fire("Error", "Failed to delete quiz", "error");
      throw error;
    }
  }, []);

  // --- RESOURCE MANAGEMENT ---
  const createResource = useCallback(async (resourceData: Omit<Resource, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .insert([resourceData])
        .select()
        .single();

      if (error) throw error;

      setResources(prev => [data, ...prev]);
      Swal.fire("Success", "Resource created successfully!", "success");
      return data;
    } catch (error: any) {
      console.error("Error creating resource:", error);
      Swal.fire("Error", "Failed to create resource", "error");
      throw error;
    }
  }, []);

  const deleteResource = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setResources(prev => prev.filter(resource => resource.id !== id));
      Swal.fire("Success", "Resource deleted successfully!", "success");
    } catch (error: any) {
      console.error("Error deleting resource:", error);
      Swal.fire("Error", "Failed to delete resource", "error");
      throw error;
    }
  }, []);

  // --- ANNOUNCEMENT MANAGEMENT ---
  const createAnnouncement = useCallback(async (announcementData: Omit<Announcement, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert([announcementData])
        .select()
        .single();

      if (error) throw error;

      setAnnouncements(prev => [data, ...prev]);
      Swal.fire("Success", "Announcement created successfully!", "success");
      return data;
    } catch (error: any) {
      console.error("Error creating announcement:", error);
      Swal.fire("Error", "Failed to create announcement", "error");
      throw error;
    }
  }, []);

  const deleteAnnouncement = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
      Swal.fire("Success", "Announcement deleted successfully!", "success");
    } catch (error: any) {
      console.error("Error deleting announcement:", error);
      Swal.fire("Error", "Failed to delete announcement", "error");
      throw error;
    }
  }, []);

  // --- FILTERED PARTICIPANTS ---
  const filteredParticipants = useMemo(() => {
    return participants.filter(participant => {
      const matchesSearch = 
        filters.search === "" ||
        participant.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        participant.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesClass = 
        filters.classLevel === "" || 
        participant.classLevel === filters.classLevel;
      
      const matchesCourse = 
        filters.course === "" || 
        participant.courses.some(course => course.includes(filters.course));
      
      const matchesPayment = 
        filters.paymentStatus === "" || 
        (filters.paymentStatus === "paid" && participant.paid) ||
        (filters.paymentStatus === "unpaid" && !participant.paid);
      
      const matchesQuizLink = 
        filters.hasQuizLink === "" ||
        (filters.hasQuizLink === "has_link" && participant.quizLink) ||
        (filters.hasQuizLink === "no_link" && !participant.quizLink);

      return matchesSearch && matchesClass && matchesCourse && matchesPayment && matchesQuizLink;
    });
  }, [participants, filters]);

  // --- STATISTICS ---
  const statistics = useMemo(() => {
    const total = participants.length;
    const paid = participants.filter(p => p.paid).length;
    const withQuizLinks = participants.filter(p => p.quizLink).length;
    const withScores = participants.filter(p => p.quizAttempts && p.quizAttempts.length > 0).length;
    
    const participantsWithScores = participants.filter(p => p.quizAttempts && p.quizAttempts.length > 0);
    const averageTotalScore = participantsWithScores.length > 0 
      ? participantsWithScores.reduce((sum, p) => sum + (p.totalScore || 0), 0) / participantsWithScores.length 
      : 0;

    const submittedQuizzes = quizAttempts.filter(attempt => attempt.status === 'submitted').length;
    const totalQuizScore = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageQuizScore = submittedQuizzes > 0 ? totalQuizScore / submittedQuizzes : 0;

    return {
      total,
      paid,
      withQuizLinks,
      withScores,
      averageTotalScore: Math.round(averageTotalScore * 100) / 100,
      paymentRate: total > 0 ? (paid / total) * 100 : 0,
      totalQuizzes: quizzes.length,
      totalResources: resources.length,
      totalAnnouncements: announcements.length,
      submittedQuizzes,
      averageQuizScore: Math.round(averageQuizScore * 100) / 100
    };
  }, [participants, quizzes, resources, announcements, quizAttempts]);

  // --- TOTAL REVENUE ---
  const totalRevenue = useMemo(() => 
    participants.reduce((sum, p) => sum + (p.paid ? p.amountPaid || 0 : 0), 0),
    [participants]
  );

  // --- BULK SELECTION ---
  const toggleParticipantSelection = useCallback((id: string) => {
    setSelectedParticipants(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedParticipants(prev => {
      if (prev.size === filteredParticipants.length) {
        return new Set();
      } else {
        return new Set(filteredParticipants.map(p => p.id));
      }
    });
  }, [filteredParticipants]);

  // --- GET UNIQUE FILTER OPTIONS ---
  const uniqueClassLevels = useMemo(() => 
    Array.from(new Set(participants.map(p => p.classLevel))).filter(Boolean),
    [participants]
  );

  const uniqueCourses = useMemo(() => 
    Array.from(new Set(participants.flatMap(p => p.courses))).filter(Boolean),
    [participants]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AdminHeader
        adminSettings={adminSettings}
        setAdminSettings={setAdminSettings}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
        fetchParticipants={fetchAllData}
        addDebugLog={addDebugLog}
      />

      {showDebug && (
        <DebugPanel
          debugLog={debugLog}
          setDebugLog={setDebugLog}
          fetchParticipants={fetchAllData}
        />
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'participants', label: 'Participants' },
            { id: 'quizzes', label: 'Quiz Management' },
            { id: 'quiz-results', label: 'Quiz Results' },
            { id: 'resources', label: 'Resources' },
            { id: 'announcements', label: 'Announcements' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'content', label: 'Content Manager' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <>
          <ChartsSection participants={participants} />
          <StatisticsCards statistics={statistics} />
          <AccountingSection
            totalRevenue={totalRevenue}
            fetchParticipants={fetchAllData}
            filteredParticipants={filteredParticipants}
            selectedParticipants={selectedParticipants}
            setSelectedParticipants={setSelectedParticipants}
            addDebugLog={addDebugLog}
            participants={participants}
            updateParticipants={updateParticipants}
          />
        </>
      )}

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <>
          <FiltersSection
            filters={filters}
            setFilters={setFilters}
            uniqueClassLevels={uniqueClassLevels}
            uniqueCourses={uniqueCourses}
          />

          {selectedParticipants.size > 0 && (
            <BulkActions
              selectedParticipants={selectedParticipants}
              bulkAction={bulkAction}
              setBulkAction={setBulkAction}
              filteredParticipants={filteredParticipants}
              participants={participants}
              updateParticipants={updateParticipants}
              setSelectedParticipants={setSelectedParticipants}
              addDebugLog={addDebugLog}
            />
          )}

          <ParticipantsTable
            loading={loading}
            filteredParticipants={filteredParticipants}
            selectedParticipants={selectedParticipants}
            toggleParticipantSelection={toggleParticipantSelection}
            toggleSelectAll={toggleSelectAll}
            deleteParticipant={deleteParticipant}
            openEditModal={openEditModal}
            openViewModal={openViewModal}
            quizLinkUpdates={quizLinkUpdates}
            handleQuizLinkChange={handleQuizLinkChange}
            updateQuizLink={updateQuizLink}
          />
        </>
      )}

      {/* Quiz Management Tab */}
      {activeTab === 'quizzes' && (
        <QuizManagement
          quizzes={quizzes}
          onQuizCreated={(quiz) => {
            console.log('Quiz created:', quiz);
            setQuizzes(prev => [quiz, ...prev]);
          }}
          onQuizUpdated={(updatedQuiz) => {
            console.log('Quiz updated:', updatedQuiz);
            setQuizzes(prev => 
              prev.map(quiz => quiz.id === updatedQuiz.id ? updatedQuiz : quiz)
            );
          }}
          onQuizDeleted={(quizId) => {
            console.log('Quiz deleted:', quizId);
            setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
          }}
        />
      )}

      {/* Quiz Results Tab */}
      {activeTab === 'quiz-results' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Quiz Results & Proctoring</h2>
            <div className="flex gap-2">
              <button
                onClick={fetchAllQuizAttempts}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Refresh Results
              </button>
              <div className="relative group">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm flex items-center gap-2">
                  Export Results
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => exportQuizResults('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => exportQuizResults('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => exportQuizResults('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {quizAttempts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No quiz attempts found</div>
              <div className="text-gray-400 text-sm mt-2">
                Quiz results will appear here once participants complete quizzes
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quiz & Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Captures
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quizAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.registrations?.fullName || 'Unknown Participant'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.registrations?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.quizzes?.title || 'Unknown Quiz'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Subject: {attempt.quizzes?.subject || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.score}/{attempt.total_questions}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.total_questions > 0 ? 
                            Math.round((attempt.score / attempt.total_questions) * 100) : 0
                          }%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          attempt.status === 'submitted' 
                            ? 'bg-green-100 text-green-800'
                            : attempt.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {attempt.warnings > 0 ? (
                          <span className="text-red-600 font-medium">
                            {attempt.warnings} warning{attempt.warnings !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-green-600">Clean</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor((attempt.duration_seconds || attempt.time_spent || 0) / 60)}m {(attempt.duration_seconds || attempt.time_spent || 0) % 60}s
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CapturesButton 
                          participantId={attempt.participant_id}
                          participantName={attempt.registrations?.fullName || 'Unknown'}
                          quizAttemptId={attempt.id} // Pass the specific quiz attempt ID
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.submitted_at ? 
                          new Date(attempt.submitted_at).toLocaleString() : 
                          'Not submitted'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <ResourceManagement
          resources={resources}
          createResource={createResource}
          deleteResource={deleteResource}
          loading={loading}
        />
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <AnnouncementManagement
          announcements={announcements}
          createAnnouncement={createAnnouncement}
          deleteAnnouncement={deleteAnnouncement}
          loading={loading}
        />
      )}

      {/* Content Manager Tab */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Management</h2>
          <AdminContentManager />
        </div>
      )}
      
      {/* Modals */}
      <ViewParticipantModel
        participant={selectedParticipant}
        isOpen={viewModalOpen}
        onClose={closeModals}
      />

      <EditParticipantModal
        participant={selectedParticipant}
        isOpen={editModalOpen}
        onClose={closeModals}
        onSave={updateParticipant}
      />
    </div>
  );
};

export default AdminDashboard;