import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HashRouter, Routes, Route } from "react-router-dom";
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
    return (_jsx(HashRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/signin", element: _jsx(SignIn, {}) }), _jsx(Route, { path: "/admin-dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ParticipantDashboard, {}) }), _jsx(Route, { path: "/quiz-login", element: _jsx(QuizLogin, {}) }), _jsx(Route, { path: "/quiz-link", element: _jsx(QuizLinkEntry, {}) }), _jsx(Route, { path: "/quiz/:quizId", element: _jsx(QuizPage, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/alumni", element: _jsx(Alumni, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "*", element: _jsx(Home, {}) })] }) }));
}
export default App;
