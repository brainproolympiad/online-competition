import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Admin/QuestionManager.tsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
const QuestionManager = () => {
    const [questions, setQuestions] = useState([]);
    const [text, setText] = useState("");
    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");
    const [answer, setAnswer] = useState("A");
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const handleAddQuestion = () => {
        const newQ = {
            text,
            options: { A: optionA, B: optionB, C: optionC, D: optionD },
            answer,
            subject,
            difficulty,
        };
        setQuestions([...questions, newQ]);
        setText("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setAnswer("A");
    };
    const handleUploadToSupabase = async () => {
        if (questions.length === 0)
            return Swal.fire("Warning", "No questions to upload", "warning");
        const { error } = await supabase.from("questions").insert(questions);
        if (error)
            Swal.fire("Error", error.message, "error");
        else {
            Swal.fire("Success", `${questions.length} questions uploaded`, "success");
            setQuestions([]);
        }
    };
    return (_jsxs("div", { className: "p-4 bg-white rounded shadow", children: [_jsx("h2", { className: "font-bold text-xl mb-4", children: "Add Questions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: [_jsx("textarea", { value: text, onChange: e => setText(e.target.value), placeholder: "Question text", className: "border p-2" }), _jsx("input", { value: optionA, onChange: e => setOptionA(e.target.value), placeholder: "Option A", className: "border p-2" }), _jsx("input", { value: optionB, onChange: e => setOptionB(e.target.value), placeholder: "Option B", className: "border p-2" }), _jsx("input", { value: optionC, onChange: e => setOptionC(e.target.value), placeholder: "Option C", className: "border p-2" }), _jsx("input", { value: optionD, onChange: e => setOptionD(e.target.value), placeholder: "Option D", className: "border p-2" }), _jsxs("select", { value: answer, onChange: e => setAnswer(e.target.value), className: "border p-2", children: [_jsx("option", { value: "A", children: "A" }), _jsx("option", { value: "B", children: "B" }), _jsx("option", { value: "C", children: "C" }), _jsx("option", { value: "D", children: "D" })] }), _jsx("input", { value: subject, onChange: e => setSubject(e.target.value), placeholder: "Subject", className: "border p-2" }), _jsxs("select", { value: difficulty, onChange: e => setDifficulty(e.target.value), className: "border p-2", children: [_jsx("option", { value: "Easy", children: "Easy" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "Hard", children: "Hard" })] })] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx("button", { onClick: handleAddQuestion, className: "bg-blue-600 text-white px-4 py-2 rounded", children: "Add Question" }), _jsx("button", { onClick: handleUploadToSupabase, className: "bg-green-600 text-white px-4 py-2 rounded", children: "Upload All" })] }), _jsxs("p", { className: "mt-2", children: [questions.length, " questions ready to upload"] })] }));
};
export default QuestionManager;
