// src/components/Admin/QuestionManager.tsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

interface Question {
  text: string;
  options: { A: string; B: string; C: string; D: string };
  answer: string;
  explanation?: string;
  subject?: string;
  difficulty?: string;
}

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [text, setText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [answer, setAnswer] = useState("A");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const handleAddQuestion = () => {
    const newQ: Question = {
      text,
      options: { A: optionA, B: optionB, C: optionC, D: optionD },
      answer,
      subject,
      difficulty,
    };
    setQuestions([...questions, newQ]);
    setText(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD(""); setAnswer("A");
  };

  const handleUploadToSupabase = async () => {
    if (questions.length === 0) return Swal.fire("Warning", "No questions to upload", "warning");
    const { error } = await supabase.from("questions").insert(questions);
    if (error) Swal.fire("Error", error.message, "error");
    else {
      Swal.fire("Success", `${questions.length} questions uploaded`, "success");
      setQuestions([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold text-xl mb-4">Add Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Question text" className="border p-2"/>
        <input value={optionA} onChange={e=>setOptionA(e.target.value)} placeholder="Option A" className="border p-2"/>
        <input value={optionB} onChange={e=>setOptionB(e.target.value)} placeholder="Option B" className="border p-2"/>
        <input value={optionC} onChange={e=>setOptionC(e.target.value)} placeholder="Option C" className="border p-2"/>
        <input value={optionD} onChange={e=>setOptionD(e.target.value)} placeholder="Option D" className="border p-2"/>
        <select value={answer} onChange={e=>setAnswer(e.target.value)} className="border p-2">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="border p-2"/>
        <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="border p-2">
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={handleAddQuestion} className="bg-blue-600 text-white px-4 py-2 rounded">Add Question</button>
        <button onClick={handleUploadToSupabase} className="bg-green-600 text-white px-4 py-2 rounded">Upload All</button>
      </div>
      <p className="mt-2">{questions.length} questions ready to upload</p>
    </div>
  );
};

export default QuestionManager;
