// src/components/Admin/ExamGenerator.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

const ExamGenerator: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [duration, setDuration] = useState(30); // minutes

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase.from("questions").select("*");
    if (error) Swal.fire("Error", error.message, "error");
    else setAllQuestions(data);
  };

  const generateCode = () => Math.random().toString(36).substring(2,10).toUpperCase();

  const handleCreateExam = async () => {
    if (!title || questionCount <= 0) return Swal.fire("Warning", "Enter title and valid question count", "warning");
    if (allQuestions.length < questionCount) return Swal.fire("Warning", "Not enough questions in bank", "warning");
    
    // Randomly pick questions
    const shuffled = [...allQuestions].sort(()=>Math.random()-0.5);
    const selectedQuestions = shuffled.slice(0, questionCount).map(q=>q.id);

    const exam_code = generateCode();
    const { error } = await supabase.from("exams").insert([{
      exam_code, title, subject, question_count: questionCount, duration, questions: selectedQuestions
    }]);

    if (error) Swal.fire("Error", error.message, "error");
    else Swal.fire("Success", `Exam created with code: ${exam_code}`, "success");
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-6">
      <h2 className="font-bold text-xl mb-4">Generate Exam</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input placeholder="Exam Title" value={title} onChange={e=>setTitle(e.target.value)} className="border p-2"/>
        <input placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} className="border p-2"/>
        <input type="number" placeholder="Number of Questions" value={questionCount} onChange={e=>setQuestionCount(parseInt(e.target.value))} className="border p-2"/>
        <input type="number" placeholder="Duration (minutes)" value={duration} onChange={e=>setDuration(parseInt(e.target.value))} className="border p-2"/>
      </div>
      <button onClick={handleCreateExam} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">Create Exam</button>
    </div>
  );
};

export default ExamGenerator;
