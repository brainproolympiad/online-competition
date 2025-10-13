import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/QuizManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Swal from 'sweetalert2';
import { RichTextEditor } from './RichTextEditor';
const QuizManagement = ({ quizzes, onQuizCreated, onQuizUpdated, onQuizDeleted, }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [classLevels, setClassLevels] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
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
    const [questionForm, setQuestionForm] = useState({
        question_text: '',
        question_type: 'multiple_choice',
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
            if (error)
                throw error;
            // Extract unique class levels
            const classLevelsSet = new Set();
            const coursesSet = new Set();
            data.forEach(item => {
                if (item.classLevel && item.classLevel.trim() !== '') {
                    classLevelsSet.add(item.classLevel.trim());
                }
                // Extract courses from courses field
                if (item.courses) {
                    let coursesArray = [];
                    if (typeof item.courses === 'string') {
                        try {
                            coursesArray = JSON.parse(item.courses);
                        }
                        catch {
                            coursesArray = item.courses.split(',').map(c => c.trim());
                        }
                    }
                    else if (Array.isArray(item.courses)) {
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
        }
        catch (error) {
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
    const fetchQuestions = async (quizId) => {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('quiz_id', quizId)
                .order('question_order');
            if (error)
                throw error;
            setQuestions(data || []);
        }
        catch (error) {
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
            const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
            if (missingHeaders.length > 0) {
                throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
            }
            const questionsToImport = [];
            let importedCount = 0;
            let errorCount = 0;
            for (let i = 1; i < lines.length; i++) {
                try {
                    const line = lines[i];
                    const values = parseCSVLine(line);
                    if (values.length < requiredHeaders.length)
                        continue;
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] ? values[index].replace(/^"|"$/g, '').trim() : '';
                    });
                    // Validate required fields
                    if (!row.question_text || !row.option_a || !row.option_b || !row.correct_answer) {
                        errorCount++;
                        continue;
                    }
                    const question = {
                        quiz_id: selectedQuiz.id,
                        question_text: row.question_text,
                        question_type: (row.question_type || 'multiple_choice'),
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
                }
                catch (error) {
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
                if (error)
                    throw error;
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
                    ''}
          </div>
        `,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
        catch (error) {
            console.error('Import error:', error);
            Swal.fire('Import Failed', error.message, 'error');
        }
        finally {
            setImporting(false);
        }
    };
    // Helper function to parse CSV lines (handles commas within quotes)
    const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            }
            else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            }
            else {
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
        }
        catch (error) {
            console.error('Error creating quiz:', error);
            Swal.fire('Error', error.message, 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const addQuestion = async () => {
        if (!selectedQuiz)
            return;
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
            if (error)
                throw error;
            setQuestions(prev => [...prev, data]);
            resetQuestionForm();
            Swal.fire({
                title: 'Success!',
                text: 'Question added successfully!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
        catch (error) {
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
    const generateQuizLink = (quizId) => {
        return `${window.location.origin}/quiz-login/${quizId}`;
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            title: 'Copied!',
            text: 'Quiz login link copied to clipboard',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };
    const deleteQuestion = async (questionId) => {
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
                if (error)
                    throw error;
                setQuestions(prev => prev.filter(q => q.id !== questionId));
                Swal.fire('Deleted!', 'Question has been deleted.', 'success');
            }
            catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    };
    const toggleQuizActive = async (quiz) => {
        try {
            const { error } = await supabase
                .from('quizzes')
                .update({ is_active: !quiz.is_active })
                .eq('id', quiz.id);
            if (error)
                throw error;
            onQuizUpdated({ ...quiz, is_active: !quiz.is_active });
            Swal.fire('Success', `Quiz ${!quiz.is_active ? 'activated' : 'deactivated'}`, 'success');
        }
        catch (error) {
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
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6 border border-gray-100", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Quiz Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Create and manage quizzes with proctoring for different classes and courses" })] }), _jsxs("button", { onClick: () => setShowCreateModal(true), className: "bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), _jsx("span", { children: "Create New Quiz" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: quizzes.map(quiz => (_jsxs("div", { className: "bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-gray-800 mb-1", children: quiz.title }), _jsx("p", { className: "text-gray-600 text-sm mb-2 line-clamp-2", children: quiz.description })] }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${quiz.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'}`, children: quiz.is_active ? 'Active' : 'Inactive' })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("svg", { className: "w-4 h-4 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("span", { children: [quiz.duration_minutes, " min"] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("svg", { className: "w-4 h-4 text-purple-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsxs("span", { children: [quiz.total_questions, " Qs"] })] })] }), _jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4", children: _jsxs("div", { className: "text-xs text-yellow-800", children: [_jsxs("div", { className: "font-medium", children: ["Class: ", quiz.class_level] }), _jsxs("div", { className: "font-medium", children: ["Subject: ", quiz.subject] }), _jsxs("div", { className: "text-xs mt-1", children: ["Courses: ", quiz.target_courses?.join(', ')] }), _jsxs("div", { className: "font-mono text-xs mt-1 break-all", children: ["ID: ", quiz.id] })] }) }), _jsxs("div", { className: "flex flex-wrap gap-1 mb-4", children: [quiz.proctoring_settings?.enable_webcam && (_jsx("span", { className: "bg-red-100 text-red-800 text-xs px-2 py-1 rounded", children: "\uD83D\uDCF9 Webcam" })), quiz.proctoring_settings?.enable_screen_recording && (_jsx("span", { className: "bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded", children: "\uD83D\uDDA5\uFE0F Screen" })), quiz.proctoring_settings?.enable_tab_monitoring && (_jsx("span", { className: "bg-green-100 text-green-800 text-xs px-2 py-1 rounded", children: "\uD83D\uDD0D Tab Monitor" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("button", { onClick: () => copyToClipboard(generateQuizLink(quiz.id)), className: "w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }), _jsx("span", { children: "Copy Quiz Link" })] }), _jsxs("button", { onClick: () => setSelectedQuiz(quiz), className: "w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }), _jsx("span", { children: "Manage Questions" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => toggleQuizActive(quiz), className: `py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${quiz.is_active
                                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                : 'bg-green-500 text-white hover:bg-green-600'}`, children: quiz.is_active ? 'Deactivate' : 'Activate' }), _jsx("button", { onClick: () => onQuizDeleted(quiz.id), className: "bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200", children: "Delete" })] })] })] }, quiz.id))) }), showCreateModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800", children: "Create New Quiz" }), _jsx("button", { onClick: () => setShowCreateModal(false), className: "text-gray-400 hover:text-gray-600 transition-colors duration-200", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Class Level *" }), _jsxs("select", { value: quizForm.class_level, onChange: (e) => setQuizForm(prev => ({
                                                        ...prev,
                                                        class_level: e.target.value
                                                    })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", children: [_jsx("option", { value: "", children: "Select Class Level" }), classLevels.map(level => (_jsx("option", { value: level, children: level }, level)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Subject *" }), _jsxs("select", { value: quizForm.subject, onChange: (e) => setQuizForm(prev => ({ ...prev, subject: e.target.value })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", children: [_jsx("option", { value: "", children: "Select Subject" }), commonSubjects.map(subject => (_jsx("option", { value: subject, children: subject }, subject)))] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Target Courses *" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: availableCourses.map(course => (_jsxs("label", { className: "flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50", children: [_jsx("input", { type: "checkbox", checked: quizForm.target_courses.includes(course), onChange: (e) => {
                                                            if (e.target.checked) {
                                                                setQuizForm(prev => ({
                                                                    ...prev,
                                                                    target_courses: [...prev.target_courses, course]
                                                                }));
                                                            }
                                                            else {
                                                                setQuizForm(prev => ({
                                                                    ...prev,
                                                                    target_courses: prev.target_courses.filter(c => c !== course)
                                                                }));
                                                            }
                                                        }, className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: course })] }, course))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Quiz Title *" }), _jsx("input", { type: "text", value: quizForm.title, onChange: (e) => setQuizForm(prev => ({ ...prev, title: e.target.value })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", placeholder: "Enter quiz title..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: quizForm.description, onChange: (e) => setQuizForm(prev => ({ ...prev, description: e.target.value })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", rows: 3, placeholder: "Enter quiz description..." })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Duration (minutes)" }), _jsx("input", { type: "number", value: quizForm.duration_minutes, onChange: (e) => setQuizForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", min: "1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Total Questions" }), _jsx("input", { type: "number", value: quizForm.total_questions, onChange: (e) => setQuizForm(prev => ({ ...prev, total_questions: parseInt(e.target.value) })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", min: "1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Passing Score (%)" }), _jsx("input", { type: "number", value: quizForm.passing_score, onChange: (e) => setQuizForm(prev => ({ ...prev, passing_score: parseInt(e.target.value) })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", min: "1", max: "100" })] })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-gray-800 mb-4", children: "\uD83D\uDEE1\uFE0F Proctoring Settings" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: quizForm.proctoring_settings.enable_webcam, onChange: (e) => setQuizForm(prev => ({
                                                                ...prev,
                                                                proctoring_settings: {
                                                                    ...prev.proctoring_settings,
                                                                    enable_webcam: e.target.checked
                                                                }
                                                            })), className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Webcam Monitoring" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: quizForm.proctoring_settings.enable_screen_recording, onChange: (e) => setQuizForm(prev => ({
                                                                ...prev,
                                                                proctoring_settings: {
                                                                    ...prev.proctoring_settings,
                                                                    enable_screen_recording: e.target.checked
                                                                }
                                                            })), className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Screen Recording" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: quizForm.proctoring_settings.enable_tab_monitoring, onChange: (e) => setQuizForm(prev => ({
                                                                ...prev,
                                                                proctoring_settings: {
                                                                    ...prev.proctoring_settings,
                                                                    enable_tab_monitoring: e.target.checked
                                                                }
                                                            })), className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Tab Monitoring" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: quizForm.proctoring_settings.enable_copy_paste_block, onChange: (e) => setQuizForm(prev => ({
                                                                ...prev,
                                                                proctoring_settings: {
                                                                    ...prev.proctoring_settings,
                                                                    enable_copy_paste_block: e.target.checked
                                                                }
                                                            })), className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Block Copy/Paste" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: quizForm.proctoring_settings.enable_full_screen, onChange: (e) => setQuizForm(prev => ({
                                                                ...prev,
                                                                proctoring_settings: {
                                                                    ...prev.proctoring_settings,
                                                                    enable_full_screen: e.target.checked
                                                                }
                                                            })), className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Force Full Screen" })] })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("input", { type: "checkbox", id: "is_active", checked: quizForm.is_active, onChange: (e) => setQuizForm(prev => ({ ...prev, is_active: e.target.checked })), className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("label", { htmlFor: "is_active", className: "text-sm font-medium text-gray-700", children: "Activate quiz immediately" })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200", children: [_jsx("button", { onClick: () => setShowCreateModal(false), className: "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium", children: "Cancel" }), _jsx("button", { onClick: createQuiz, disabled: loading || !quizForm.title || !quizForm.class_level || !quizForm.subject || quizForm.target_courses.length === 0, className: "px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium", children: loading ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Creating..." })] })) : ('Create Quiz') })] })] }) })), selectedQuiz && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800", children: "Manage Questions" }), _jsx("p", { className: "text-gray-600 mt-1", children: selectedQuiz.title }), _jsxs("div", { className: "flex space-x-4 mt-2 text-sm text-gray-500", children: [_jsxs("span", { children: ["Class: ", selectedQuiz.class_level] }), _jsxs("span", { children: ["Subject: ", selectedQuiz.subject] }), _jsxs("span", { children: ["Courses: ", selectedQuiz.target_courses?.join(', ')] }), _jsxs("span", { className: "font-mono", children: ["ID: ", selectedQuiz.id] })] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: exportTemplateCSV, className: "px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("span", { children: "Template" })] }), _jsxs("button", { onClick: exportQuestionsToCSV, disabled: questions.length === 0, className: "px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsxs("span", { children: ["Export (", questions.length, ")"] })] }), _jsxs("button", { onClick: () => setShowImportModal(true), className: "px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" }) }), _jsx("span", { children: "Import" })] }), _jsx("button", { onClick: () => setSelectedQuiz(null), className: "text-gray-400 hover:text-gray-600 transition-colors duration-200 ml-2", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })] }), _jsxs("div", { className: "mb-8 p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50", children: [_jsxs("h4", { className: "font-semibold text-lg text-gray-800 mb-4 flex items-center space-x-2", children: [_jsx("svg", { className: "w-5 h-5 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), _jsx("span", { children: "Add New Question" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Question Text *" }), _jsx(RichTextEditor, { value: questionForm.question_text, onChange: (content) => setQuestionForm(prev => ({ ...prev, question_text: content })), placeholder: "Enter your question here... You can use formatting, formulas, and images." })] }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: ['a', 'b', 'c', 'd'].map(option => (_jsxs("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Option ", option.toUpperCase(), " *"] }), _jsx(RichTextEditor, { value: questionForm.options[option], onChange: (content) => setQuestionForm(prev => ({
                                                            ...prev,
                                                            options: { ...prev.options, [option]: content }
                                                        })), placeholder: `Enter option ${option.toUpperCase()}...`, compact: true })] }, option))) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Correct Answer" }), _jsxs("select", { value: questionForm.correct_answer, onChange: (e) => setQuestionForm(prev => ({ ...prev, correct_answer: e.target.value })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", children: [_jsx("option", { value: "a", children: "Option A" }), _jsx("option", { value: "b", children: "Option B" }), _jsx("option", { value: "c", children: "Option C" }), _jsx("option", { value: "d", children: "Option D" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Marks" }), _jsx("input", { type: "number", value: questionForm.marks, onChange: (e) => setQuestionForm(prev => ({ ...prev, marks: parseInt(e.target.value) })), className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", min: "1" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Explanation (Optional)" }), _jsx(RichTextEditor, { value: questionForm.explanation, onChange: (content) => setQuestionForm(prev => ({ ...prev, explanation: content })), placeholder: "Add explanation for the correct answer...", compact: true })] }), _jsx("button", { onClick: addQuestion, disabled: !questionForm.question_text.trim(), className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105", children: "Add Question to Quiz" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h4", { className: "font-semibold text-lg text-gray-800", children: ["Existing Questions (", questions.length, ")"] }), _jsxs("span", { className: "text-sm text-gray-500", children: ["Total Marks: ", questions.reduce((sum, q) => sum + q.marks, 0)] })] }), questions.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300", children: [_jsx("svg", { className: "w-12 h-12 text-gray-400 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("p", { className: "text-gray-500", children: "No questions added yet. Start by adding your first question above." }), _jsx("button", { onClick: () => setShowImportModal(true), className: "mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200", children: "Or Import from CSV" })] })) : (_jsx("div", { className: "space-y-4", children: questions.map((question, index) => (_jsxs("div", { className: "border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsxs("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: ["Q", index + 1] }), _jsxs("span", { className: "bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium", children: [question.marks, " mark", question.marks !== 1 ? 's' : ''] })] }), _jsx("div", { className: "prose prose-sm max-w-none", dangerouslySetInnerHTML: { __html: question.question_text } })] }), _jsx("button", { onClick: () => deleteQuestion(question.id), className: "ml-4 text-red-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] }), _jsx("div", { className: "grid grid-cols-2 gap-3 mb-4", children: Object.entries(question.options).map(([key, value]) => (_jsxs("div", { className: `p-3 rounded-lg border-2 transition-all duration-200 ${key === question.correct_answer
                                                        ? 'bg-green-50 border-green-500 shadow-sm'
                                                        : 'bg-gray-50 border-gray-200'}`, children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("span", { className: `font-medium text-sm ${key === question.correct_answer
                                                                        ? 'text-green-800'
                                                                        : 'text-gray-700'}`, children: key.toUpperCase() }), key === question.correct_answer && (_jsx("span", { className: "bg-green-500 text-white px-2 py-1 rounded text-xs font-medium", children: "Correct" }))] }), _jsx("div", { className: "prose prose-sm max-w-none", dangerouslySetInnerHTML: { __html: value } })] }, key))) }), question.explanation && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("span", { className: "text-sm font-medium text-blue-800", children: "Explanation" })] }), _jsx("div", { className: "prose prose-sm max-w-none text-blue-900", dangerouslySetInnerHTML: { __html: question.explanation } })] }))] }, question.id))) }))] })] }) })), showImportModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl p-6 w-full max-w-2xl", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800", children: "Import Questions from CSV" }), _jsx("button", { onClick: () => setShowImportModal(false), className: "text-gray-400 hover:text-gray-600 transition-colors duration-200", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-blue-800 mb-2", children: "CSV Format Requirements" }), _jsxs("ul", { className: "text-sm text-blue-700 space-y-1 list-disc list-inside", children: [_jsx("li", { children: "Required columns: question_text, option_a, option_b, option_c, option_d, correct_answer" }), _jsx("li", { children: "Optional columns: question_type, marks, explanation" }), _jsx("li", { children: "Correct answer should be a, b, c, or d" }), _jsx("li", { children: "Marks should be a number (default: 1)" }), _jsx("li", { children: "Question type should be \"multiple_choice\" (default)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select CSV File *" }), _jsx("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center", children: importFile ? (_jsxs("div", { className: "text-green-600", children: [_jsx("svg", { className: "w-12 h-12 mx-auto mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("p", { className: "font-medium", children: importFile.name }), _jsxs("p", { className: "text-sm text-gray-500", children: [(importFile.size / 1024).toFixed(2), " KB"] }), _jsx("button", { onClick: () => setImportFile(null), className: "mt-2 text-red-500 hover:text-red-700 text-sm", children: "Remove File" })] })) : (_jsxs("div", { children: [_jsx("svg", { className: "w-12 h-12 text-gray-400 mx-auto mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" }) }), _jsx("p", { className: "text-gray-600 mb-2", children: "Drag and drop your CSV file here, or click to browse" }), _jsx("input", { type: "file", accept: ".csv", onChange: (e) => setImportFile(e.target.files?.[0] || null), className: "hidden", id: "csv-upload" }), _jsx("label", { htmlFor: "csv-upload", className: "inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer transition-colors duration-200", children: "Browse Files" })] })) })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-4 border-t border-gray-200", children: [_jsx("button", { onClick: () => {
                                                setShowImportModal(false);
                                                setImportFile(null);
                                            }, className: "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium", children: "Cancel" }), _jsx("button", { onClick: exportTemplateCSV, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium", children: "Download Template" }), _jsx("button", { onClick: importQuestionsFromCSV, disabled: !importFile || importing, className: "px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium", children: importing ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Importing..." })] })) : ('Import Questions') })] })] })] }) }))] }));
};
export default QuizManagement;
