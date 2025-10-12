import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import ParticipantDashboard from "./pages/dashboards/participantDashboard/ParticipantDashboard";
import AdminDashboard from "./pages/dashboards/adminDashboard/AdminDashboard";
import QuizLogin from "./pages/QuizLogin";
import QuizPage from "./pages/QuizPage";
import About from "./pages/About";
import Alumni from "./pages/Alumni";
import Contact from "./pages/Contact";
import QuizLinkEntry from "./pages/QuizLinkEntry";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<ParticipantDashboard />} />

      {/* Quiz routes */}
      <Route path="/quiz-login" element={<QuizLogin />} />
      <Route path="/quiz-link" element={<QuizLinkEntry />} />
      <Route path="/quiz/:quizId" element={<QuizPage />} />

      {/* Info pages */}
      <Route path="/about" element={<About />} />
      <Route path="/alumni" element={<Alumni />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
