import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ExamManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Swal from 'sweetalert2';
const ExamManagement = ({ exams, onExamCreated, onExamUpdated, onExamDeleted, }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [examForm, setExamForm] = useState({
        title: '',
        description: '',
        duration_minutes: 60,
        total_questions: 10,
        passing_score: 50,
        is_active: true
    });
    const [questionForm, setQuestionForm] = useState({
        question_text: '',
        question_type: 'multiple_choice',
        options: { a: '', b: '', c: '', d: '' },
        correct_answer: 'a',
        marks: 1,
        question_order: 1
    });
    const createExam = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('exams')
                .insert([examForm])
                .select()
                .single();
            if (error)
                throw error;
            onExamCreated(data);
            setShowCreateModal(false);
            setExamForm({
                title: '',
                description: '',
                duration_minutes: 60,
                total_questions: 10,
                passing_score: 50,
                is_active: true
            });
            Swal.fire('Success', 'Exam created successfully!', 'success');
        }
        catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const addQuestion = async () => {
        if (!selectedExam)
            return;
        try {
            const { data, error } = await supabase
                .from('questions')
                .insert([{ ...questionForm, exam_id: selectedExam.id }])
                .select()
                .single();
            if (error)
                throw error;
            setQuestions(prev => [...prev, data]);
            setQuestionForm({
                question_text: '',
                question_type: 'multiple_choice',
                options: { a: '', b: '', c: '', d: '' },
                correct_answer: 'a',
                marks: 1,
                question_order: questions.length + 1
            });
            Swal.fire('Success', 'Question added successfully!', 'success');
        }
        catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };
    const generateExamLink = (examId) => {
        return `${window.location.origin}/exam/${examId}`;
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire('Copied!', 'Exam link copied to clipboard', 'success');
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Exam Management" }), _jsx("button", { onClick: () => setShowCreateModal(true), className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600", children: "Create New Exam" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: exams.map(exam => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-lg mb-2", children: exam.title }), _jsx("p", { className: "text-gray-600 text-sm mb-2", children: exam.description }), _jsxs("div", { className: "flex justify-between text-sm text-gray-500 mb-4", children: [_jsxs("span", { children: ["Duration: ", exam.duration_minutes, "min"] }), _jsxs("span", { children: ["Questions: ", exam.total_questions] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { onClick: () => copyToClipboard(generateExamLink(exam.id)), className: "w-full bg-green-500 text-white py-1 rounded text-sm", children: "Copy Exam Link" }), _jsx("button", { onClick: () => setSelectedExam(exam), className: "w-full bg-blue-500 text-white py-1 rounded text-sm", children: "Manage Questions" }), _jsx("button", { onClick: () => onExamDeleted(exam.id), className: "w-full bg-red-500 text-white py-1 rounded text-sm", children: "Delete Exam" })] })] }, exam.id))) }), showCreateModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-md", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Create New Exam" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Exam Title" }), _jsx("input", { type: "text", value: examForm.title, onChange: (e) => setExamForm(prev => ({ ...prev, title: e.target.value })), className: "w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Description" }), _jsx("textarea", { value: examForm.description, onChange: (e) => setExamForm(prev => ({ ...prev, description: e.target.value })), className: "w-full border rounded px-3 py-2", rows: 3 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Duration (minutes)" }), _jsx("input", { type: "number", value: examForm.duration_minutes, onChange: (e) => setExamForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) })), className: "w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Total Questions" }), _jsx("input", { type: "number", value: examForm.total_questions, onChange: (e) => setExamForm(prev => ({ ...prev, total_questions: parseInt(e.target.value) })), className: "w-full border rounded px-3 py-2" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Passing Score (%)" }), _jsx("input", { type: "number", value: examForm.passing_score, onChange: (e) => setExamForm(prev => ({ ...prev, passing_score: parseInt(e.target.value) })), className: "w-full border rounded px-3 py-2" })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx("button", { onClick: () => setShowCreateModal(false), className: "px-4 py-2 border rounded", children: "Cancel" }), _jsx("button", { onClick: createExam, disabled: loading, className: "px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50", children: loading ? 'Creating...' : 'Create Exam' })] })] }) })), selectedExam && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h3", { className: "text-xl font-semibold", children: ["Manage Questions: ", selectedExam.title] }), _jsx("button", { onClick: () => setSelectedExam(null), className: "text-gray-500 hover:text-gray-700", children: "\u2715" })] }), _jsxs("div", { className: "mb-6 p-4 border rounded", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Add New Question" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Question Text" }), _jsx("textarea", { value: questionForm.question_text, onChange: (e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value })), className: "w-full border rounded px-3 py-2", rows: 3 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Option A" }), _jsx("input", { type: "text", value: questionForm.options.a, onChange: (e) => setQuestionForm(prev => ({
                                                                ...prev,
                                                                options: { ...prev.options, a: e.target.value }
                                                            })), className: "w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Option B" }), _jsx("input", { type: "text", value: questionForm.options.b, onChange: (e) => setQuestionForm(prev => ({
                                                                ...prev,
                                                                options: { ...prev.options, b: e.target.value }
                                                            })), className: "w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Option C" }), _jsx("input", { type: "text", value: questionForm.options.c, onChange: (e) => setQuestionForm(prev => ({
                                                                ...prev,
                                                                options: { ...prev.options, c: e.target.value }
                                                            })), className: "w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Option D" }), _jsx("input", { type: "text", value: questionForm.options.d, onChange: (e) => setQuestionForm(prev => ({
                                                                ...prev,
                                                                options: { ...prev.options, d: e.target.value }
                                                            })), className: "w-full border rounded px-3 py-2" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Correct Answer" }), _jsxs("select", { value: questionForm.correct_answer, onChange: (e) => setQuestionForm(prev => ({ ...prev, correct_answer: e.target.value })), className: "w-full border rounded px-3 py-2", children: [_jsx("option", { value: "a", children: "Option A" }), _jsx("option", { value: "b", children: "Option B" }), _jsx("option", { value: "c", children: "Option C" }), _jsx("option", { value: "d", children: "Option D" })] })] }), _jsx("button", { onClick: addQuestion, className: "w-full bg-green-500 text-white py-2 rounded", children: "Add Question" })] })] }), _jsxs("div", { children: [_jsxs("h4", { className: "font-semibold mb-3", children: ["Existing Questions (", questions.length, ")"] }), _jsx("div", { className: "space-y-4", children: questions.map((question, index) => (_jsxs("div", { className: "border rounded p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("h5", { className: "font-medium", children: ["Q", index + 1, ": ", question.question_text] }), _jsxs("span", { className: "bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm", children: [question.marks, " mark", question.marks !== 1 ? 's' : ''] })] }), _jsx("div", { className: "grid grid-cols-2 gap-2 text-sm", children: Object.entries(question.options).map(([key, value]) => (_jsxs("div", { className: `p-2 rounded ${key === question.correct_answer
                                                        ? 'bg-green-100 border border-green-500'
                                                        : 'bg-gray-100'}`, children: [_jsxs("strong", { children: [key.toUpperCase(), ":"] }), " ", value, key === question.correct_answer && (_jsx("span", { className: "ml-2 text-green-600", children: "\u2713 Correct" }))] }, key))) })] }, question.id))) })] })] }) }))] }));
};
export default ExamManagement;
