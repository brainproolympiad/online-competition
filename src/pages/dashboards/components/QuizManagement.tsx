// src/components/QuizManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Swal from 'sweetalert2';
import { RichTextEditor } from './RichTextEditor';
import type { Question } from '../types/cbtTypes';

// Define Quiz type here if not exported from cbtTypes
export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  is_active: boolean;
  class_level: string;
  target_classes: string[];
  target_courses: string[];
  instructions: string;
  start_time: string;
  end_time: string;
  proctoring_settings: {
    enable_webcam: boolean;
    enable_screen_recording: boolean;
    enable_tab_monitoring: boolean;
    enable_copy_paste_block: boolean;
    enable_full_screen: boolean;
    max_cheat_attempts: number;
  };
  created_at?: string;
  updated_at?: string;
}

interface QuizManagementProps {
  quizzes: Quiz[];
  onQuizCreated: (quiz: Quiz) => void;
  onQuizUpdated: (quiz: Quiz) => void;
  onQuizDeleted: (quizId: string) => void;
}

// Interface for CSV import/export
interface QuestionCSVRow {
  question_text: string;
  question_type: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  marks: string;
  explanation: string;
}

const QuizManagement: React.FC<QuizManagementProps> = ({
  quizzes,
  onQuizCreated,
  onQuizUpdated,
  onQuizDeleted,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classLevels, setClassLevels] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    subject: '',
    duration_minutes: 60,
    total_questions: 10,
    passing_score: 50,
    is_active: true,
    class_level: '',
    target_classes: [] as string[],
    target_courses: [] as string[],
    instructions: 'Read each question carefully. You cannot go back to previous questions. Do not refresh the page during the quiz.',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    proctoring_settings: {
      enable_webcam: true,
      enable_screen_recording: true,
      enable_tab_monitoring: true,
      enable_copy_paste_block: true,
      enable_full_screen: true,
      max_cheat_attempts: 3
    }
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    question_type: 'multiple_choice' as const,
    options: { a: '', b: '', c: '', d: '' },
    correct_answer: 'a',
    marks: 1,
    question_order: 1,
    explanation: ''
  });

  // Fetch available class levels and courses from participants
  useEffect(() => {
    fetchClassLevelsAndCourses();
  }, []);

  // Fetch questions when quiz is selected
  useEffect(() => {
    if (selectedQuiz) {
      fetchQuestions(selectedQuiz.id);
    }
  }, [selectedQuiz]);

  const fetchClassLevelsAndCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('classLevel, courses')
        .not('classLevel', 'is', null)
        .limit(1000);

      if (error) throw error;
      
      // Extract unique class levels
      const classLevelsSet = new Set<string>();
      const coursesSet = new Set<string>();
      
      data.forEach(item => {
        if (item.classLevel && item.classLevel.trim() !== '') {
          classLevelsSet.add(item.classLevel.trim());
        }
        
        // Extract courses from courses field
        if (item.courses) {
          let coursesArray: string[] = [];
          if (typeof item.courses === 'string') {
            try {
              coursesArray = JSON.parse(item.courses);
            } catch {
              coursesArray = item.courses.split(',').map(c => c.trim());
            }
          } else if (Array.isArray(item.courses)) {
            coursesArray = item.courses;
          }
          
          coursesArray.forEach(course => {
            if (course && course.trim() !== '') {
              coursesSet.add(course.trim());
            }
          });
        }
      });

      setClassLevels(Array.from(classLevelsSet).sort());
      setAvailableCourses(Array.from(coursesSet).sort());
      
    } catch (error: unknown) {
      console.error('Error fetching class levels and courses:', error);
      // Fallback data
      setClassLevels([
        'JSS 1', 'JSS 2', 'JSS 3', 
        'SS 1', 'SS 2', 'SS 3',
        'Primary 1', 'Primary 2', 'Primary 3', 
        'Primary 4', 'Primary 5', 'Primary 6'
      ]);
      setAvailableCourses([
        'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
        'Further Mathematics', 'Literature', 'Government', 'Economics',
        'Accounting', 'Commerce', 'Geography', 'History', 'Civic Education',
        'Computer Studies', 'Agricultural Science'
      ]);
    }
  };

  const fetchQuestions = async (quizId: string) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_order');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      Swal.fire('Error', 'Failed to fetch questions', 'error');
    }
  };

  // ==================== IMPORT/EXPORT FUNCTIONS ====================

  // Export questions to CSV
  const exportQuestionsToCSV = () => {
    if (!selectedQuiz || questions.length === 0) {
      Swal.fire('Error', 'No questions to export', 'error');
      return;
    }

    const csvHeaders = [
      'question_text',
      'question_type',
      'option_a',
      'option_b',
      'option_c',
      'option_d',
      'correct_answer',
      'marks',
      'explanation'
    ];

    const csvData = questions.map(question => [
      question.question_text.replace(/"/g, '""'), // Escape quotes
      question.question_type,
      question.options.a.replace(/"/g, '""'),
      question.options.b.replace(/"/g, '""'),
      question.options.c.replace(/"/g, '""'),
      question.options.d.replace(/"/g, '""'),
      question.correct_answer,
      question.marks.toString(),
      question.explanation?.replace(/"/g, '""') || ''
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedQuiz.title}_questions.csv`.replace(/[^a-z0-9]/gi, '_').toLowerCase());
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Success', `Exported ${questions.length} questions to CSV`, 'success');
  };

  // Export template CSV
  const exportTemplateCSV = () => {
    const templateHeaders = [
      'question_text',
      'question_type',
      'option_a',
      'option_b',
      'option_c',
      'option_d',
      'correct_answer',
      'marks',
      'explanation'
    ];

    const templateData = [
      'What is the capital of France?',
      'multiple_choice',
      'London',
      'Berlin',
      'Paris',
      'Madrid',
      'c',
      '1',
      'Paris is the capital and most populous city of France.'
    ];

    const csvContent = [
      templateHeaders.join(','),
      templateData.map(field => `"${field}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'question_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import questions from CSV
  const importQuestionsFromCSV = async () => {
    if (!importFile || !selectedQuiz) {
      Swal.fire('Error', 'Please select a file to import', 'error');
      return;
    }

    setImporting(true);
    try {
      const text = await importFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file is empty or invalid');
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const requiredHeaders = ['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'];
      
      const missingHeaders = requiredHeaders.filter(header => 
        !headers.includes(header)
      );
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const questionsToImport: Partial<Question>[] = [];
      let importedCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        try {
          const line = lines[i];
          const values = parseCSVLine(line);
          
          if (values.length < requiredHeaders.length) continue;

          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].replace(/^"|"$/g, '').trim() : '';
          });

          // Validate required fields
          if (!row.question_text || !row.option_a || !row.option_b || !row.correct_answer) {
            errorCount++;
            continue;
          }

          const question: Partial<Question> = {
            quiz_id: selectedQuiz.id,
            question_text: row.question_text,
            question_type: (row.question_type || 'multiple_choice') as 'multiple_choice',
            options: {
              a: row.option_a,
              b: row.option_b,
              c: row.option_c || '',
              d: row.option_d || ''
            },
            correct_answer: row.correct_answer.toLowerCase(),
            marks: parseInt(row.marks) || 1,
            explanation: row.explanation || '',
            question_order: questions.length + questionsToImport.length + 1,
            created_at: new Date().toISOString()
          };

          questionsToImport.push(question);
          importedCount++;
        } catch (error) {
          errorCount++;
          console.error(`Error parsing line ${i + 1}:`, error);
        }
      }

      if (questionsToImport.length === 0) {
        throw new Error('No valid questions found in the file');
      }

      // Insert questions in batches to avoid timeout
      const batchSize = 10;
      for (let i = 0; i < questionsToImport.length; i += batchSize) {
        const batch = questionsToImport.slice(i, i + batchSize);
        const { error } = await supabase
          .from('questions')
          .insert(batch);

        if (error) throw error;
      }

      // Refresh questions list
      await fetchQuestions(selectedQuiz.id);
      
      setShowImportModal(false);
      setImportFile(null);

      Swal.fire({
        title: 'Import Complete!',
        html: `
          <div class="text-left">
            <p class="mb-2">Successfully imported ${importedCount} questions</p>
            ${errorCount > 0 ? 
              `<p class="text-orange-600 text-sm">${errorCount} rows had errors and were skipped</p>` : 
              ''
            }
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error: any) {
      console.error('Import error:', error);
      Swal.fire('Import Failed', error.message, 'error');
    } finally {
      setImporting(false);
    }
  };

  // Helper function to parse CSV lines (handles commas within quotes)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const createQuiz = async () => {
    if (!quizForm.class_level || quizForm.target_courses.length === 0) {
      Swal.fire('Error', 'Please select class level and at least one target course', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const quizData = {
        title: quizForm.title,
        description: quizForm.description,
        subject: quizForm.subject,
        duration_minutes: quizForm.duration_minutes,
        total_questions: quizForm.total_questions,
        passing_score: quizForm.passing_score,
        is_active: quizForm.is_active,
        class_level: quizForm.class_level,
        target_classes: [quizForm.class_level],
        target_courses: quizForm.target_courses,
        instructions: quizForm.instructions,
        start_time: quizForm.start_time,
        end_time: quizForm.end_time,
        proctoring_settings: quizForm.proctoring_settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Creating quiz with data:', quizData);

      const { data, error } = await supabase
        .from('quizzes')
        .insert([quizData])
        .select()
        .single();

      if (error) {
        console.error('❌ Quiz creation error:', error);
        throw error;
      }

      console.log('✅ Quiz created successfully:', data);
      
      onQuizCreated(data);
      setShowCreateModal(false);
      resetQuizForm();
      
      // Generate and show the quiz link
      const quizLink = generateQuizLink(data.id);
      console.log('🔗 Generated quiz link:', quizLink);
      
      Swal.fire({
        title: 'Success!',
        html: `
          <div class="text-left">
            <p class="mb-2">Quiz created successfully!</p>
            <p class="text-sm text-gray-600 mb-3">Quiz Link:</p>
            <code class="bg-gray-100 p-2 rounded text-xs block break-all">${quizLink}</code>
            <p class="text-xs text-gray-500 mt-2">This quiz will be visible to ${quizForm.class_level} students taking: ${quizForm.target_courses.join(', ')}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Copy Link & Close',
        showCancelButton: true,
        cancelButtonText: 'Close',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          copyToClipboard(quizLink);
        }
      });
      
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    if (!selectedQuiz) return;

    if (!questionForm.question_text.trim()) {
      Swal.fire('Error', 'Please enter question text', 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([{ 
          ...questionForm, 
          quiz_id: selectedQuiz.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setQuestions(prev => [...prev, data]);
      resetQuestionForm();
      
      Swal.fire({
        title: 'Success!',
        text: 'Question added successfully!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const resetQuizForm = () => {
    setQuizForm({
      title: '',
      description: '',
      subject: '',
      duration_minutes: 60,
      total_questions: 10,
      passing_score: 50,
      is_active: true,
      class_level: '',
      target_classes: [],
      target_courses: [],
      instructions: 'Read each question carefully. You cannot go back to previous questions. Do not refresh the page during the quiz.',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      proctoring_settings: {
        enable_webcam: true,
        enable_screen_recording: true,
        enable_tab_monitoring: true,
        enable_copy_paste_block: true,
        enable_full_screen: true,
        max_cheat_attempts: 3
      }
    });
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question_text: '',
      question_type: 'multiple_choice',
      options: { a: '', b: '', c: '', d: '' },
      correct_answer: 'a',
      marks: 1,
      question_order: questions.length + 1,
      explanation: ''
    });
  };

  // Generate quiz login link
  const generateQuizLink = (quizId: string) => {
    return `${window.location.origin}/quiz-login/${quizId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: 'Copied!',
      text: 'Quiz login link copied to clipboard',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const deleteQuestion = async (questionId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This question will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', questionId);

        if (error) throw error;
        
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        Swal.fire('Deleted!', 'Question has been deleted.', 'success');
      } catch (error: any) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  const toggleQuizActive = async (quiz: Quiz) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_active: !quiz.is_active })
        .eq('id', quiz.id);

      if (error) throw error;
      
      onQuizUpdated({ ...quiz, is_active: !quiz.is_active });
      Swal.fire('Success', `Quiz ${!quiz.is_active ? 'activated' : 'deactivated'}`, 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Common subjects
  const commonSubjects = [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Further Mathematics',
    'Literature',
    'Government',
    'Economics',
    'Accounting',
    'Commerce',
    'Geography',
    'History',
    'Civic Education',
    'Computer Studies',
    'Agricultural Science'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quiz Management
          </h2>
          <p className="text-gray-600 mt-2">Create and manage quizzes with proctoring for different classes and courses</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">{quiz.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{quiz.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                quiz.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {quiz.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{quiz.duration_minutes} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{quiz.total_questions} Qs</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="text-xs text-yellow-800">
                <div className="font-medium">Class: {quiz.class_level}</div>
                <div className="font-medium">Subject: {quiz.subject}</div>
                <div className="text-xs mt-1">Courses: {quiz.target_courses?.join(', ')}</div>
                <div className="font-mono text-xs mt-1 break-all">ID: {quiz.id}</div>
              </div>
            </div>

            {/* Proctoring Badges */}
            <div className="flex flex-wrap gap-1 mb-4">
              {quiz.proctoring_settings?.enable_webcam && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">📹 Webcam</span>
              )}
              {quiz.proctoring_settings?.enable_screen_recording && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">🖥️ Screen</span>
              )}
              {quiz.proctoring_settings?.enable_tab_monitoring && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">🔍 Tab Monitor</span>
              )}
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(generateQuizLink(quiz.id))}
                className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Quiz Link</span>
              </button>
              <button
                onClick={() => setSelectedQuiz(quiz)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Manage Questions</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleQuizActive(quiz)}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    quiz.is_active
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {quiz.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => onQuizDeleted(quiz.id)}
                  className="bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Create New Quiz</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Level *
                  </label>
                  <select
                    value={quizForm.class_level}
                    onChange={(e) => setQuizForm(prev => ({ 
                      ...prev, 
                      class_level: e.target.value
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Class Level</option>
                    {classLevels.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={quizForm.subject}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Subject</option>
                    {commonSubjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Courses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Courses *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableCourses.map(course => (
                    <label key={course} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={quizForm.target_courses.includes(course)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setQuizForm(prev => ({
                              ...prev,
                              target_courses: [...prev.target_courses, course]
                            }));
                          } else {
                            setQuizForm(prev => ({
                              ...prev,
                              target_courses: prev.target_courses.filter(c => c !== course)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{course}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter quiz title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={quizForm.description}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Enter quiz description..."
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={quizForm.duration_minutes}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Questions</label>
                  <input
                    type="number"
                    value={quizForm.total_questions}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, total_questions: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    value={quizForm.passing_score}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              {/* Proctoring Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-4">🛡️ Proctoring Settings</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizForm.proctoring_settings.enable_webcam}
                      onChange={(e) => setQuizForm(prev => ({
                        ...prev,
                        proctoring_settings: {
                          ...prev.proctoring_settings,
                          enable_webcam: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Webcam Monitoring</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizForm.proctoring_settings.enable_screen_recording}
                      onChange={(e) => setQuizForm(prev => ({
                        ...prev,
                        proctoring_settings: {
                          ...prev.proctoring_settings,
                          enable_screen_recording: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Screen Recording</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizForm.proctoring_settings.enable_tab_monitoring}
                      onChange={(e) => setQuizForm(prev => ({
                        ...prev,
                        proctoring_settings: {
                          ...prev.proctoring_settings,
                          enable_tab_monitoring: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Tab Monitoring</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizForm.proctoring_settings.enable_copy_paste_block}
                      onChange={(e) => setQuizForm(prev => ({
                        ...prev,
                        proctoring_settings: {
                          ...prev.proctoring_settings,
                          enable_copy_paste_block: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Block Copy/Paste</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizForm.proctoring_settings.enable_full_screen}
                      onChange={(e) => setQuizForm(prev => ({
                        ...prev,
                        proctoring_settings: {
                          ...prev.proctoring_settings,
                          enable_full_screen: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Force Full Screen</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={quizForm.is_active}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Activate quiz immediately
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createQuiz}
                disabled={loading || !quizForm.title || !quizForm.class_level || !quizForm.subject || quizForm.target_courses.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Quiz'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Management Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Manage Questions</h3>
                <p className="text-gray-600 mt-1">{selectedQuiz.title}</p>
                <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                  <span>Class: {selectedQuiz.class_level}</span>
                  <span>Subject: {selectedQuiz.subject}</span>
                  <span>Courses: {selectedQuiz.target_courses?.join(', ')}</span>
                  <span className="font-mono">ID: {selectedQuiz.id}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Import/Export Buttons */}
                <button
                  onClick={exportTemplateCSV}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Template</span>
                </button>
                <button
                  onClick={exportQuestionsToCSV}
                  disabled={questions.length === 0}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export ({questions.length})</span>
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Import</span>
                </button>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 ml-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add Question Form */}
            <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Question</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                  <RichTextEditor
                    value={questionForm.question_text}
                    onChange={(content) => setQuestionForm(prev => ({ ...prev, question_text: content }))}
                    placeholder="Enter your question here... You can use formatting, formulas, and images."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['a', 'b', 'c', 'd'].map(option => (
                    <div key={option} className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option {option.toUpperCase()} *
                      </label>
                      <RichTextEditor
                        value={questionForm.options[option as keyof typeof questionForm.options]}
                        onChange={(content) => setQuestionForm(prev => ({
                          ...prev,
                          options: { ...prev.options, [option]: content }
                        }))}
                        placeholder={`Enter option ${option.toUpperCase()}...`}
                        compact={true}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    <select
                      value={questionForm.correct_answer}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, correct_answer: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="a">Option A</option>
                      <option value="b">Option B</option>
                      <option value="c">Option C</option>
                      <option value="d">Option D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                    <input
                      type="number"
                      value={questionForm.marks}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                  <RichTextEditor
                    value={questionForm.explanation}
                    onChange={(content) => setQuestionForm(prev => ({ ...prev, explanation: content }))}
                    placeholder="Add explanation for the correct answer..."
                    compact={true}
                  />
                </div>

                <button
                  onClick={addQuestion}
                  disabled={!questionForm.question_text.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  Add Question to Quiz
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg text-gray-800">
                  Existing Questions ({questions.length})
                </h4>
                <span className="text-sm text-gray-500">
                  Total Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
                </span>
              </div>
              
              {questions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No questions added yet. Start by adding your first question above.</p>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Or Import from CSV
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              Q{index + 1}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                              {question.marks} mark{question.marks !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: question.question_text }}
                          />
                        </div>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="ml-4 text-red-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {Object.entries(question.options).map(([key, value]) => (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              key === question.correct_answer
                                ? 'bg-green-50 border-green-500 shadow-sm'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`font-medium text-sm ${
                                key === question.correct_answer 
                                  ? 'text-green-800' 
                                  : 'text-gray-700'
                              }`}>
                                {key.toUpperCase()}
                              </span>
                              {key === question.correct_answer && (
                                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  Correct
                                </span>
                              )}
                            </div>
                            <div 
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: value }}
                            />
                          </div>
                        ))}
                      </div>

                      {question.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-blue-800">Explanation</span>
                          </div>
                          <div 
                            className="prose prose-sm max-w-none text-blue-900"
                            dangerouslySetInnerHTML={{ __html: question.explanation }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Import Questions Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Import Questions from CSV</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">CSV Format Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Required columns: question_text, option_a, option_b, option_c, option_d, correct_answer</li>
                  <li>Optional columns: question_type, marks, explanation</li>
                  <li>Correct answer should be a, b, c, or d</li>
                  <li>Marks should be a number (default: 1)</li>
                  <li>Question type should be "multiple_choice" (default)</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {importFile ? (
                    <div className="text-green-600">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium">{importFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(importFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => setImportFile(null)}
                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      <p className="text-gray-600 mb-2">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label
                        htmlFor="csv-upload"
                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer transition-colors duration-200"
                      >
                        Browse Files
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={exportTemplateCSV}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  Download Template
                </button>
                <button
                  onClick={importQuestionsFromCSV}
                  disabled={!importFile || importing}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {importing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Importing...</span>
                    </div>
                  ) : (
                    'Import Questions'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;