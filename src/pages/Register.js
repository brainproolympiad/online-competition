import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// MultiStepRegistration.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient";
import { FaUser, FaGraduationCap, FaBook, FaUserCircle, FaCreditCard, FaCheckCircle, FaArrowRight, FaArrowLeft, } from "react-icons/fa";
import PersonalInfo from "../components/registration/steps/PersonalInfo";
import EducationInfo from "../components/registration/steps/EducationInfo";
import CourseSelection from "../components/registration/steps/CourseSelection";
import AccountSetup from "../components/registration/steps/AccountSetup";
import PaymentStep from "../components/registration/steps/PaymentStep";
import Confirmation from "../components/registration/steps/Confirmation";
const MultiStepRegistration = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    // Parent validation state passed to each step
    const [isStepValid, setIsStepValid] = useState(false);
    const steps = [
        { title: "Personal Info", icon: _jsx(FaUser, {}) },
        { title: "Education Info", icon: _jsx(FaGraduationCap, {}) },
        { title: "Course Selection", icon: _jsx(FaBook, {}) },
        { title: "Account Setup", icon: _jsx(FaUserCircle, {}) },
        { title: "Payment", icon: _jsx(FaCreditCard, {}) },
        { title: "Confirmation", icon: _jsx(FaCheckCircle, {}) },
    ];
    // Make sure validation resets when changing steps (so Next doesn't stay enabled)
    useEffect(() => {
        setIsStepValid(false);
    }, [activeStep]);
    // Render the actual step component and pass setIsStepValid
    const renderStepComponent = (stepIndex) => {
        const commonProps = { formData, setFormData, setStepValid: setIsStepValid };
        switch (stepIndex) {
            case 0:
                return _jsx(PersonalInfo, { ...commonProps });
            case 1:
                return _jsx(EducationInfo, { ...commonProps });
            case 2:
                return _jsx(CourseSelection, { ...commonProps });
            case 3:
                return _jsx(AccountSetup, { ...commonProps });
            case 4:
                return _jsx(PaymentStep, { ...commonProps });
            case 5:
                // Confirmation typically doesn't need validation; pass setStepValid just in case
                return _jsx(Confirmation, { formData: formData });
            default:
                return null;
        }
    };
    const nextStep = () => {
        if (!isStepValid)
            return; // guard
        if (activeStep < steps.length - 1)
            setActiveStep((prev) => prev + 1);
    };
    const prevStep = () => {
        if (activeStep > 0)
            setActiveStep((prev) => prev - 1);
    };
    const progress = ((activeStep + 1) / steps.length) * 100;
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from("registrations")
                .insert([{ ...formData, paid: false, created_at: new Date() }]);
            if (error)
                throw error;
            await Swal.fire({
                icon: "success",
                title: "Registration Complete",
                text: "Your registration was successful! Please sign in to continue.",
                confirmButtonText: "Go to Sign In",
                confirmButtonColor: "#2563eb",
            });
            navigate("/signin");
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed to Save Registration",
                text: err.message || "Something went wrong. Please try again.",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-10 px-4", children: _jsxs("div", { className: "w-full max-w-3xl bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden", children: [_jsxs("div", { className: "bg-white border-b border-gray-100 py-6 text-center", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-800", children: "Academic Registration" }), _jsxs("p", { className: "text-gray-500 text-sm mt-1", children: ["Step ", activeStep + 1, " of ", steps.length] })] }), _jsx("div", { className: "px-6 pt-4", children: _jsx("div", { className: "h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-in-out", style: { width: `${progress}%` } }) }) }), _jsx("div", { className: "flex justify-between px-6 py-3 text-xs text-gray-500 font-medium", children: steps.map((step, i) => (_jsxs("div", { className: `flex flex-col items-center gap-1 transition-all ${i === activeStep ? "text-blue-600 font-semibold scale-105" : i < activeStep ? "text-green-600" : "text-gray-400"}`, children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center border ${i === activeStep ? "bg-blue-600 text-white shadow-md" : i < activeStep ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400 border-gray-300"}`, children: i < activeStep ? _jsx(FaCheckCircle, {}) : step.icon }), _jsx("span", { children: step.title })] }, i))) }), _jsx("div", { className: "p-8 bg-gray-50 border-t border-gray-100 transition-all duration-700 ease-in-out", children: renderStepComponent(activeStep) }), _jsxs("div", { className: "flex justify-between items-center px-8 py-6 bg-white border-t border-gray-100", children: [activeStep > 0 ? (_jsxs("button", { onClick: prevStep, className: "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all", children: [_jsx(FaArrowLeft, {}), " Previous"] })) : (_jsx("div", {})), activeStep < steps.length - 1 ? (_jsxs("button", { onClick: nextStep, disabled: !isStepValid, className: `flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${isStepValid ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`, children: ["Next ", _jsx(FaArrowRight, {})] })) : (_jsx("button", { onClick: handleSubmit, disabled: loading, className: `flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`, children: loading ? "Saving..." : "Complete Registration" }))] })] }) }));
};
export default MultiStepRegistration;
