import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/QuizPage.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import { useProctoring } from "../hooks/useProctoring";
import Calculator from "../pages/dashboards/components/Calculator";
import QuizResults from "../pages/dashboards/components/QuizResults";
import QuizInstructions from "../pages/dashboards/components/QuizInstructions";
import LoadingSpinner from "../pages/dashboards/components/LoadingSpinner";
import ErrorMessage from "../pages/dashboards/components/ErrorMessage";
import WebcamCapture from "../pages/dashboards/components/WebcamCapture";
import { saveCapture } from "../pages/dashboards/utils/saveCapture";
const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [quizAttemptId, setQuizAttemptId] = useState(null);
    const [hasExistingAttempt, setHasExistingAttempt] = useState(false);
    const [isCheckingAttempts, setIsCheckingAttempts] = useState(false);
    const [activeQuizSession, setActiveQuizSession] = useState(null);
    const [totalWarnings, setTotalWarnings] = useState(0);
    const [previousAttempts, setPreviousAttempts] = useState([]);
    const [canRetakeQuiz, setCanRetakeQuiz] = useState(true);
    const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
    const [latestCompletedAttempt, setLatestCompletedAttempt] = useState(null);
    const [webcamActive, setWebcamActive] = useState(false);
    const [quizDuration, setQuizDuration] = useState(0);
    const videoRef = useRef(null);
    // Proctoring hook
    const { warnings, proctoringError, initializeProctoring, saveProctoringData, } = useProctoring({
        enable_webcam: true,
        enable_screen_recording: false,
        enable_tab_monitoring: true,
        enable_copy_paste_block: true,
        enable_full_screen: true,
        max_cheat_attempts: 5,
    }, quizId || "");
    useEffect(() => {
        if (warnings > totalWarnings) {
            setTotalWarnings(warnings);
        }
    }, [warnings, totalWarnings]);
    // Add this useEffect to handle automatic submission when warnings reach 5
    useEffect(() => {
        if (warnings >= 5 && quizStarted && !showResults) {
            console.log("Max warnings reached. Auto-submitting quiz...");
            handleSubmitQuiz(true, "Maximum warnings exceeded", warnings, ["Exceeded maximum allowed warnings"]);
        }
    }, [warnings, quizStarted, showResults]);
    // Clean HTML tags from text
    const cleanText = (text) => {
        if (!text)
            return '';
        return text.replace(/<[^>]*>/g, '');
    };
    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = localStorage.getItem("user");
                if (!userData)
                    return;
                const parsedUser = JSON.parse(userData);
                const email = parsedUser.email;
                if (!email)
                    return;
                const { data, error } = await supabase
                    .from("registrations")
                    .select("id, email, fullName, classLevel, courses")
                    .eq("email", email)
                    .single();
                if (error || !data) {
                    setUser({
                        email: parsedUser.email,
                        fullName: parsedUser.fullName || "Student",
                        classLevel: parsedUser.classLevel || "Not specified",
                        course: parsedUser.course || "General",
                    });
                }
                else {
                    setUser({
                        id: data.id,
                        email: data.email,
                        fullName: data.fullName || "Student",
                        classLevel: data.classLevel || "Not specified",
                        course: data.course || "General",
                    });
                }
            }
            catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);
    const checkExistingAttempts = async () => {
        if (!quizId || !user?.id)
            return;
        setIsCheckingAttempts(true);
        try {
            const { data, error } = await supabase
                .from('quiz_attempts')
                .select('*')
                .eq('quiz_id', quizId)
                .eq('participant_id', user.id)
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error checking existing attempts:', error);
                return;
            }
            if (data && data.length > 0) {
                setPreviousAttempts(data);
                const hasAnyAttempt = data.length > 0;
                const incompleteAttempt = data.find(attempt => !attempt.submitted_at);
                if (incompleteAttempt) {
                    setHasExistingAttempt(true);
                    setActiveQuizSession(incompleteAttempt.id);
                    setQuizAttemptId(incompleteAttempt.id);
                    if (incompleteAttempt.user_answers) {
                        setAnswers(incompleteAttempt.user_answers);
                    }
                }
                const completedAttempts = data.filter(attempt => attempt.submitted_at);
                if (completedAttempts.length > 0) {
                    setLatestCompletedAttempt(completedAttempts[0]);
                }
                const maxAttempts = quiz?.max_attempts || 1;
                const allowRetakes = quiz?.allow_retakes !== false;
                if (hasAnyAttempt) {
                    setMaxAttemptsReached(true);
                    setCanRetakeQuiz(false);
                }
                else {
                    setMaxAttemptsReached(false);
                    setCanRetakeQuiz(true);
                }
            }
            else {
                setCanRetakeQuiz(true);
                setMaxAttemptsReached(false);
            }
        }
        catch (err) {
            console.error('Error checking existing attempts:', err);
        }
        finally {
            setIsCheckingAttempts(false);
        }
    };
    // Fetch quiz and check attempts
    useEffect(() => {
        const fetchQuizData = async () => {
            if (!quizId)
                return;
            try {
                const { data: quizData, error: quizError } = await supabase
                    .from("quizzes")
                    .select("*")
                    .eq("id", quizId)
                    .single();
                if (quizError || !quizData) {
                    setError("Quiz not found");
                    setLoading(false);
                    return;
                }
                const { count: questionCount } = await supabase
                    .from("questions")
                    .select("*", { count: "exact", head: true })
                    .eq("quiz_id", quizId);
                setQuiz({
                    ...quizData,
                    total_questions: questionCount || 0,
                    max_attempts: quizData.max_attempts || 1,
                    allow_retakes: quizData.allow_retakes !== false
                });
                const durationSeconds = (quizData.duration_minutes || 60) * 60;
                setTimeLeft(durationSeconds);
                setQuizDuration(durationSeconds);
                await fetchQuestions(quizId);
                if (user?.id) {
                    await checkExistingAttempts();
                }
            }
            catch (err) {
                console.error(err);
                setError("Failed to load quiz");
            }
            finally {
                setLoading(false);
            }
        };
        const fetchQuestions = async (quizId) => {
            setQuestionsLoading(true);
            try {
                const { data: questionsData, error: questionsError } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("quiz_id", quizId)
                    .order("question_order");
                if (questionsError || !questionsData) {
                    Swal.fire({
                        icon: "warning",
                        title: "No Questions Available",
                        text: "This quiz does not have any questions yet. Please contact your teacher.",
                    });
                }
                else {
                    // Clean HTML tags from questions and options
                    const validQuestions = questionsData
                        .filter((q) => q && q.id && q.question_text && q.options && Object.keys(q.options).length > 0)
                        .map((q) => ({
                        ...q,
                        question_text: cleanText(q.question_text),
                        options: {
                            a: cleanText(q.options.a),
                            b: cleanText(q.options.b),
                            c: cleanText(q.options.c),
                            d: cleanText(q.options.d)
                        }
                    }));
                    setQuestions(validQuestions);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setQuestionsLoading(false);
            }
        };
        fetchQuizData();
    }, [quizId, user?.id]);
    // Re-check attempts when user data is loaded
    useEffect(() => {
        if (user?.id && quizId) {
            checkExistingAttempts();
        }
    }, [user?.id, quizId]);
    const handleAnswerSelect = (questionIndex, answer) => {
        setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    };
    // Function to save quiz attempt
    const saveQuizAttempt = async (score, percentage, passed, correctAnswers, finalWarnings, finalViolations) => {
        if (!quizId || !user?.id) {
            console.error('Missing quizId or user ID');
            return null;
        }
        try {
            const now = new Date();
            const durationSeconds = quizStartTime ?
                Math.floor((now.getTime() - quizStartTime.getTime()) / 1000) : 0;
            const attemptData = {
                quiz_id: quizId,
                participant_id: user.id,
                score: score,
                percentage: percentage,
                passed: passed,
                correct_answers: correctAnswers,
                total_questions: questions.length,
                warnings: finalWarnings || totalWarnings,
                violations: finalViolations || [],
                started_at: quizStartTime?.toISOString(),
                submitted_at: now.toISOString(),
                completed_at: now.toISOString(),
                user_answers: answers,
                duration_seconds: durationSeconds,
                status: 'completed'
            };
            let result;
            if (quizAttemptId) {
                const { data, error } = await supabase
                    .from('quiz_attempts')
                    .update(attemptData)
                    .eq('id', quizAttemptId)
                    .select()
                    .single();
                if (error) {
                    console.error('Error updating quiz attempt:', error);
                    throw error;
                }
                result = data;
            }
            else {
                const { data, error } = await supabase
                    .from('quiz_attempts')
                    .insert(attemptData)
                    .select()
                    .single();
                if (error) {
                    console.error('Error creating quiz attempt:', error);
                    throw error;
                }
                result = data;
                setQuizAttemptId(data.id);
            }
            return result;
        }
        catch (err) {
            console.error('Error saving quiz attempt:', err);
            return null;
        }
    };
    const startQuiz = async () => {
        if (maxAttemptsReached) {
            Swal.fire({
                icon: "error",
                title: "Quiz Already Attempted",
                text: "You have already attempted this quiz and cannot take it again.",
                confirmButtonText: "View Previous Results"
            }).then(() => {
                if (latestCompletedAttempt) {
                    setQuizResult({
                        quiz_id: quizId,
                        quiz_title: quiz?.title,
                        score: latestCompletedAttempt.score,
                        percentage: latestCompletedAttempt.percentage,
                        passed: latestCompletedAttempt.passed,
                        total_questions: latestCompletedAttempt.total_questions,
                        correct_answers: latestCompletedAttempt.correct_answers,
                        warnings: latestCompletedAttempt.warnings || 0,
                        violations: latestCompletedAttempt.violations || [],
                        user_info: user,
                        attempt_id: latestCompletedAttempt.id,
                        completed_at: latestCompletedAttempt.completed_at,
                        duration_seconds: latestCompletedAttempt.duration_seconds || 0,
                        is_previous_attempt: true,
                        max_attempts_reached: true
                    });
                    setShowResults(true);
                }
                else if (previousAttempts.length > 0) {
                    const mostRecentAttempt = previousAttempts[0];
                    setQuizResult({
                        quiz_id: quizId,
                        quiz_title: quiz?.title,
                        score: mostRecentAttempt.score,
                        percentage: mostRecentAttempt.percentage,
                        passed: mostRecentAttempt.passed,
                        total_questions: mostRecentAttempt.total_questions,
                        correct_answers: mostRecentAttempt.correct_answers,
                        warnings: mostRecentAttempt.warnings || 0,
                        violations: mostRecentAttempt.violations || [],
                        user_info: user,
                        attempt_id: mostRecentAttempt.id,
                        completed_at: mostRecentAttempt.completed_at,
                        duration_seconds: mostRecentAttempt.duration_seconds || 0,
                        is_previous_attempt: true,
                        max_attempts_reached: true
                    });
                    setShowResults(true);
                }
            });
            return;
        }
        if (!questions || questions.length === 0) {
            Swal.fire({
                icon: "error",
                title: "No Questions",
                text: "Cannot start quiz without questions.",
            });
            return;
        }
        try {
            const { data, error } = await supabase
                .from('quiz_attempts')
                .insert({
                quiz_id: quizId,
                participant_id: user?.id,
                started_at: new Date().toISOString(),
                status: 'in_progress',
                user_answers: {}
            })
                .select()
                .single();
            if (error) {
                console.error('Error creating quiz attempt:', error);
                throw error;
            }
            setQuizAttemptId(data.id);
            setQuizStartTime(new Date(data.started_at));
            await initializeProctoring();
            setQuizStarted(true);
            setWebcamActive(true);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmitQuiz(false, "Time expired");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        catch (err) {
            console.error('Error starting quiz:', err);
            Swal.fire({
                icon: "error",
                title: "Failed to Start Quiz",
                text: err?.message || "Could not start the quiz. Please try again.",
            });
        }
    };
    const handleSubmitQuiz = async (forced = false, reason, finalWarnings, finalViolations) => {
        // Turn off webcam first
        setWebcamActive(false);
        // Calculate score based on correct answers
        let correctAnswers = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.correct_answer) {
                correctAnswers++;
            }
        });
        const totalQuestions = questions.length;
        const score = correctAnswers; // This is the actual score (number of correct answers)
        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        const passingScore = quiz?.passing_score || 50;
        const passed = percentage >= passingScore;
        const attemptData = await saveQuizAttempt(score, percentage, passed, correctAnswers, finalWarnings, finalViolations);
        if (!attemptData) {
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "Could not save your quiz results. Please try again.",
            });
            return;
        }
        setPreviousAttempts(prev => [attemptData, ...prev]);
        setLatestCompletedAttempt(attemptData);
        const completedAttempts = previousAttempts.filter(attempt => attempt.submitted_at).length + 1;
        const maxAttempts = quiz?.max_attempts || 1;
        const allowRetakes = quiz?.allow_retakes !== false;
        if (completedAttempts >= maxAttempts && !allowRetakes) {
            setMaxAttemptsReached(true);
            setCanRetakeQuiz(false);
        }
        const timeSpent = quizStartTime ?
            Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000) : 0;
        setQuizResult({
            quiz_id: quizId,
            quiz_title: quiz?.title,
            score: score,
            percentage: percentage,
            passed: passed,
            total_questions: totalQuestions,
            correct_answers: correctAnswers,
            warnings: finalWarnings || totalWarnings,
            violations: finalViolations || [],
            user_info: user,
            attempt_id: attemptData?.id,
            completed_at: new Date().toISOString(),
            duration_seconds: timeSpent,
            passing_score: passingScore,
            can_retake: canRetakeQuiz && (quiz?.allow_retakes !== false),
            previous_attempts: previousAttempts.length + 1,
            max_attempts: quiz?.max_attempts || 1,
            max_attempts_reached: completedAttempts >= maxAttempts && !allowRetakes,
            reason: reason
        });
        setShowResults(true);
    };
    // Cleanup effect for webcam
    useEffect(() => {
        return () => {
            setWebcamActive(false);
        };
    }, []);
    // Show loading state
    if (loading)
        return _jsx(LoadingSpinner, { message: "Loading quiz..." });
    // Show error state
    if (error || !quiz)
        return _jsx(ErrorMessage, { error: error, navigate: navigate });
    // Show results if quiz is completed
    if (showResults && quizResult)
        return _jsx(QuizResults, { quizResult: quizResult, quiz: quiz, user: user, navigate: navigate });
    // Show previous results if max attempts reached
    if (maxAttemptsReached && latestCompletedAttempt && !quizStarted) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 p-4 flex items-center justify-center", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Maximum Attempts Reached" }), _jsxs("p", { className: "text-gray-600 mb-6", children: ["You have already completed this quiz ", quiz.max_attempts, " time(s).", quiz.allow_retakes ? '' : ' Retakes are not allowed.'] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: () => {
                                    setQuizResult({
                                        quiz_id: quizId,
                                        quiz_title: quiz?.title,
                                        score: latestCompletedAttempt.score,
                                        percentage: latestCompletedAttempt.percentage,
                                        passed: latestCompletedAttempt.passed,
                                        total_questions: latestCompletedAttempt.total_questions,
                                        correct_answers: latestCompletedAttempt.correct_answers,
                                        warnings: latestCompletedAttempt.warnings || 0,
                                        violations: latestCompletedAttempt.violations || [],
                                        user_info: user,
                                        attempt_id: latestCompletedAttempt.id,
                                        completed_at: latestCompletedAttempt.completed_at,
                                        duration_seconds: latestCompletedAttempt.duration_seconds || 0,
                                        is_previous_attempt: true,
                                        max_attempts_reached: true
                                    });
                                    setShowResults(true);
                                }, className: "w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium", children: "View Previous Results" }), _jsx("button", { onClick: () => navigate('/participant-dashboard'), className: "w-full bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 transition-colors font-medium", children: "Back to Dashboard" })] })] }) }));
    }
    // Show instructions if quiz hasn't started
    if (!quizStarted)
        return (_jsx(QuizInstructions, { quiz: quiz, user: user, questionsLoading: questionsLoading, questions: questions, proctoringError: proctoringError, hasExistingAttempt: hasExistingAttempt, previousAttempts: previousAttempts, canRetakeQuiz: canRetakeQuiz, maxAttemptsReached: maxAttemptsReached, latestCompletedAttempt: latestCompletedAttempt, isCheckingAttempts: isCheckingAttempts, onStartQuiz: startQuiz }));
    const currentQ = questions[currentQuestion];
    if (!currentQ)
        return _jsx("div", { children: "No questions available." });
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 p-4 relative", children: [webcamActive && (_jsx("div", { className: "absolute top-4 right-4 w-40 h-40 z-50 border border-gray-300 rounded overflow-hidden bg-black", children: _jsx(WebcamCapture, { captureInterval: 0.5 * 60 * 1000, hidden: false, onPhotoCaptured: (photoData, sequenceNumber) => {
                        console.log("Captured photo #", sequenceNumber);
                        saveCapture(quiz.id, user?.id, photoData, sequenceNumber);
                    } }) })), _jsx(Calculator, {}), _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: quiz.title }), _jsx("p", { className: "text-gray-600", children: quiz.description })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-lg font-semibold text-gray-900", children: ["Time Left: ", Math.floor(timeLeft / 60), ":", (timeLeft % 60).toString().padStart(2, '0')] }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Question ", currentQuestion + 1, " of ", questions.length] })] })] }), user && (_jsx("div", { className: "border-t border-gray-200 pt-4", children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Student:" }), _jsx("div", { className: "font-medium", children: user.fullName })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Class:" }), _jsx("div", { className: "font-medium", children: user.classLevel })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Course:" }), _jsx("div", { className: "font-medium", children: quiz.title })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Warnings:" }), _jsx("div", { className: "font-medium", children: totalWarnings })] })] }) }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: ["Question ", currentQuestion + 1] }), _jsx("p", { className: "text-gray-700 text-base leading-relaxed", children: currentQ.question_text })] }), _jsx("div", { className: "space-y-3", children: Object.entries(currentQ.options).map(([key, value]) => (_jsxs("label", { className: `flex items-center p-3 border rounded-md cursor-pointer transition-colors ${answers[currentQuestion] === key
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'}`, children: [_jsx("input", { type: "radio", name: `question-${currentQuestion}`, value: key, checked: answers[currentQuestion] === key, onChange: () => handleAnswerSelect(currentQuestion, key), className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" }), _jsxs("span", { className: "ml-3 text-gray-700 font-medium", children: [key.toUpperCase(), ". ", value] })] }, key))) })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("button", { onClick: () => setCurrentQuestion((prev) => Math.max(0, prev - 1)), disabled: currentQuestion === 0, className: `px-6 py-2 rounded-md font-medium ${currentQuestion === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-600 text-white hover:bg-gray-700'}`, children: "Previous" }), _jsxs("div", { className: "text-sm text-gray-500", children: [currentQuestion + 1, " of ", questions.length] }), currentQuestion === questions.length - 1 ? (_jsx("button", { onClick: () => handleSubmitQuiz(), className: "px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700", children: "Submit Quiz" })) : (_jsx("button", { onClick: () => setCurrentQuestion((prev) => prev + 1), className: "px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700", children: "Next" }))] }) }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [Math.round(((currentQuestion + 1) / questions.length) * 100), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${((currentQuestion + 1) / questions.length) * 100}%` } }) })] })] })] }));
};
export default QuizPage;
