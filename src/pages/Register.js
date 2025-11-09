import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient";
import { FaUser, FaGraduationCap, FaBook, FaUserCircle, FaCreditCard, FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";

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
    const [isStepValid, setIsStepValid] = useState(false);

    const steps = [
        { title: "Personal Info", icon: React.createElement(FaUser) },
        { title: "Education Info", icon: React.createElement(FaGraduationCap) },
        { title: "Course Selection", icon: React.createElement(FaBook) },
        { title: "Account Setup", icon: React.createElement(FaUserCircle) },
        { title: "Payment", icon: React.createElement(FaCreditCard) },
        { title: "Confirmation", icon: React.createElement(FaCheckCircle) },
    ];

    // Watch for payment status changes
    useEffect(() => {
        console.log("📊 MultiStepRegistration - formData.paid:", formData.paid, "activeStep:", activeStep);
        
        // If we're on the payment step and payment is completed, enable next button
        if (activeStep === 4 && formData.paid) {
            console.log("✅ Payment completed on step 4, enabling next button");
            setIsStepValid(true);
        }
    }, [formData.paid, activeStep]);

    // Reset validation when changing steps, but handle payment step specially
    useEffect(() => {
        console.log("🔄 Step changed to:", activeStep);
        if (activeStep === 4) { // Payment step
            // If already paid, keep step valid
            console.log("💰 Payment step active, paid status:", formData.paid);
            setIsStepValid(!!formData.paid);
        } else {
            setIsStepValid(false);
        }
    }, [activeStep, formData.paid]);

    const renderStepComponent = (stepIndex) => {
        const commonProps = { 
            formData, 
            setFormData, 
            setStepValid: setIsStepValid 
        };

        switch (stepIndex) {
            case 0:
                return React.createElement(PersonalInfo, commonProps);
            case 1:
                return React.createElement(EducationInfo, commonProps);
            case 2:
                return React.createElement(CourseSelection, commonProps);
            case 3:
                return React.createElement(AccountSetup, commonProps);
            case 4:
                return React.createElement(PaymentStep, commonProps);
            case 5:
                return React.createElement(Confirmation, { formData });
            default:
                return null;
        }
    };

    const nextStep = () => {
        if (!isStepValid) {
            console.log("🚫 Cannot proceed - step not valid");
            return;
        }
        console.log("➡️ Moving to next step");
        if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
    };

    const prevStep = () => {
        console.log("⬅️ Moving to previous step");
        if (activeStep > 0) setActiveStep((prev) => prev - 1);
    };

    const progress = ((activeStep + 1) / steps.length) * 100;

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            // Ensure payment data is included
            const submissionData = {
                ...formData,
                created_at: new Date(),
                // Ensure paid status is explicitly set
                paid: !!formData.paid,
                payment_status: formData.paid ? 'completed' : 'pending'
            };

            console.log("📦 Submitting registration data:", submissionData);

            const { error } = await supabase
                .from("registrations")
                .insert([submissionData]);

            if (error) throw error;

            await Swal.fire({
                icon: "success",
                title: "Registration Complete",
                text: "Your registration was successful! Please sign in to continue.",
                confirmButtonText: "Go to Sign In",
                confirmButtonColor: "#2563eb",
            });

            navigate("/signin");
        } catch (err) {
            console.error("❌ Registration submission error:", err);
            Swal.fire({
                icon: "error",
                title: "Failed to Save Registration",
                text: err.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return React.createElement(
        "div",
        { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-10 px-4" },
        React.createElement(
            "div",
            { className: "w-full max-w-3xl bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden" },
            [
                // Header
                React.createElement(
                    "div",
                    { className: "bg-white border-b border-gray-100 py-6 text-center", key: "header" },
                    [
                        React.createElement("h1", { className: "text-2xl font-semibold text-gray-800", key: "title" }, "Academic Registration"),
                        React.createElement("p", { className: "text-gray-500 text-sm mt-1", key: "step" }, `Step ${activeStep + 1} of ${steps.length}`)
                    ]
                ),
                // Progress Bar
                React.createElement(
                    "div",
                    { className: "px-6 pt-4", key: "progress-container" },
                    React.createElement(
                        "div",
                        { className: "h-2 bg-gray-200 rounded-full overflow-hidden", key: "progress-bar" },
                        React.createElement("div", {
                            className: "h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-in-out",
                            style: { width: `${progress}%` },
                            key: "progress-fill"
                        })
                    )
                ),
                // Step Titles
                React.createElement(
                    "div",
                    { className: "flex justify-between px-6 py-3 text-xs text-gray-500 font-medium", key: "step-titles" },
                    steps.map((step, i) =>
                        React.createElement(
                            "div",
                            {
                                className: `flex flex-col items-center gap-1 transition-all ${
                                    i === activeStep ? "text-blue-600 font-semibold scale-105" : 
                                    i < activeStep ? "text-green-600" : "text-gray-400"
                                }`,
                                key: i
                            },
                            [
                                React.createElement(
                                    "div",
                                    {
                                        className: `w-10 h-10 rounded-full flex items-center justify-center border ${
                                            i === activeStep ? "bg-blue-600 text-white shadow-md" : 
                                            i < activeStep ? "bg-green-500 text-white" : 
                                            "bg-gray-100 text-gray-400 border-gray-300"
                                        }`,
                                        key: "icon-container"
                                    },
                                    i < activeStep ? React.createElement(FaCheckCircle, { key: "check" }) : step.icon
                                ),
                                React.createElement("span", { key: "label" }, step.title)
                            ]
                        )
                    )
                ),
                // Step Content
                React.createElement(
                    "div",
                    { className: "p-8 bg-gray-50 border-t border-gray-100 transition-all duration-700 ease-in-out", key: "step-content" },
                    renderStepComponent(activeStep)
                ),
                // Navigation
                React.createElement(
                    "div",
                    { className: "flex justify-between items-center px-8 py-6 bg-white border-t border-gray-100", key: "navigation" },
                    [
                        activeStep > 0 
                            ? React.createElement(
                                "button",
                                {
                                    onClick: prevStep,
                                    className: "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all",
                                    key: "prev-button"
                                },
                                [React.createElement(FaArrowLeft, { key: "prev-icon" }), " Previous"]
                            )
                            : React.createElement("div", { key: "prev-spacer" }),
                        activeStep < steps.length - 1 
                            ? React.createElement(
                                "button",
                                {
                                    onClick: nextStep,
                                    disabled: !isStepValid,
                                    className: `flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                                        isStepValid ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`,
                                    key: "next-button"
                                },
                                ["Next ", React.createElement(FaArrowRight, { key: "next-icon" })]
                            )
                            : React.createElement(
                                "button",
                                {
                                    onClick: handleSubmit,
                                    disabled: loading,
                                    className: `flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all ${
                                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                    }`,
                                    key: "submit-button"
                                },
                                loading ? "Saving..." : "Complete Registration"
                            )
                    ]
                )
            ]
        )
    );
};

export default MultiStepRegistration;