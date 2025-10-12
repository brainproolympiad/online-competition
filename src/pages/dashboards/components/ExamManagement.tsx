// src/components/ExamManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Swal from 'sweetalert2';
import type { Exam, Question } from '../types/cbtTypes';

interface ExamManagementProps {
  exams: Exam[];
  onExamCreated: (exam: Exam) => void;
  onExamUpdated: (exam: Exam) => void;
  onExamDeleted: (examId: string) => void;
}

const ExamManagement: React.FC<ExamManagementProps> = ({
  exams,
  onExamCreated,
  onExamUpdated,
  onExamDeleted,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
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
    question_type: 'multiple_choice' as const,
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

      if (error) throw error;
      
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
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    if (!selectedExam) return;

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([{ ...questionForm, exam_id: selectedExam.id }])
        .select()
        .single();

      if (error) throw error;
      
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
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const generateExamLink = (examId: string) => {
    return `${window.location.origin}/exam/${examId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire('Copied!', 'Exam link copied to clipboard', 'success');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Exam Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create New Exam
        </button>
      </div>

      {/* Exams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">{exam.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{exam.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>Duration: {exam.duration_minutes}min</span>
              <span>Questions: {exam.total_questions}</span>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(generateExamLink(exam.id))}
                className="w-full bg-green-500 text-white py-1 rounded text-sm"
              >
                Copy Exam Link
              </button>
              <button
                onClick={() => setSelectedExam(exam)}
                className="w-full bg-blue-500 text-white py-1 rounded text-sm"
              >
                Manage Questions
              </button>
              <button
                onClick={() => onExamDeleted(exam.id)}
                className="w-full bg-red-500 text-white py-1 rounded text-sm"
              >
                Delete Exam
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Exam</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Exam Title</label>
                <input
                  type="text"
                  value={examForm.title}
                  onChange={(e) => setExamForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={examForm.description}
                  onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={examForm.duration_minutes}
                    onChange={(e) => setExamForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Total Questions</label>
                  <input
                    type="number"
                    value={examForm.total_questions}
                    onChange={(e) => setExamForm(prev => ({ ...prev, total_questions: parseInt(e.target.value) }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Passing Score (%)</label>
                <input
                  type="number"
                  value={examForm.passing_score}
                  onChange={(e) => setExamForm(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={createExam}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Management Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Manage Questions: {selectedExam.title}</h3>
              <button
                onClick={() => setSelectedExam(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Add Question Form */}
            <div className="mb-6 p-4 border rounded">
              <h4 className="font-semibold mb-3">Add New Question</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Question Text</label>
                  <textarea
                    value={questionForm.question_text}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Option A</label>
                    <input
                      type="text"
                      value={questionForm.options.a}
                      onChange={(e) => setQuestionForm(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, a: e.target.value } 
                      }))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Option B</label>
                    <input
                      type="text"
                      value={questionForm.options.b}
                      onChange={(e) => setQuestionForm(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, b: e.target.value } 
                      }))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Option C</label>
                    <input
                      type="text"
                      value={questionForm.options.c}
                      onChange={(e) => setQuestionForm(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, c: e.target.value } 
                      }))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Option D</label>
                    <input
                      type="text"
                      value={questionForm.options.d}
                      onChange={(e) => setQuestionForm(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, d: e.target.value } 
                      }))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Correct Answer</label>
                  <select
                    value={questionForm.correct_answer}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, correct_answer: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                  </select>
                </div>

                <button
                  onClick={addQuestion}
                  className="w-full bg-green-500 text-white py-2 rounded"
                >
                  Add Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div>
              <h4 className="font-semibold mb-3">Existing Questions ({questions.length})</h4>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">Q{index + 1}: {question.question_text}</h5>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {question.marks} mark{question.marks !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-2 rounded ${
                            key === question.correct_answer
                              ? 'bg-green-100 border border-green-500'
                              : 'bg-gray-100'
                          }`}
                        >
                          <strong>{key.toUpperCase()}:</strong> {value}
                          {key === question.correct_answer && (
                            <span className="ml-2 text-green-600">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;