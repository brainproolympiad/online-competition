import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { ShieldCheck, CreditCard, Loader2 } from "lucide-react";
const PaymentStep = ({ formData, setFormData, setStepValid }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const publicKey = import.meta.env.VITE_PAYSTACK_KEY;
    const config = {
        reference: new Date().getTime().toString(),
        email: formData.email,
        amount: 5000 * 100, // ₦5,000 in kobo
        publicKey,
    };
    const initializePayment = usePaystackPayment(config);
    // ✅ Check if already paid when entering this step
    useEffect(() => {
        if (formData.paid) {
            setStepValid(true);
        }
        else {
            setStepValid(false);
        }
    }, [formData.paid, setStepValid]);
    const onSuccess = async (reference) => {
        setIsProcessing(true);
        console.log("✅ Payment success:", reference);
        const updatedData = {
            ...formData,
            paid: true,
            paymentRef: reference.reference,
        };
        setFormData(updatedData);
        setStepValid(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            const result = await res.json();
            if (result.success) {
                alert("🎉 Payment successful! Registration completed.");
            }
            else {
                alert("⚠️ Payment succeeded but registration failed to save.");
            }
        }
        catch (err) {
            console.error(err);
            alert("❌ Error submitting data. Please contact support.");
        }
        finally {
            setIsProcessing(false);
        }
    };
    const onClose = () => {
        console.log("❎ Payment window closed.");
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-lg max-w-xl mx-auto border border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(CreditCard, { className: "text-blue-600 h-8 w-8" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Step 5: Payment" })] }), _jsxs("p", { className: "text-gray-600 text-center max-w-md mb-8", children: ["Please complete your payment of", " ", _jsx("span", { className: "font-semibold text-blue-700", children: "\u20A65,000" }), " to finalize your registration. Your payment is securely processed by", " ", _jsx("span", { className: "font-bold text-green-600", children: "Paystack" }), "."] }), _jsxs("div", { className: "w-full bg-white rounded-xl p-6 shadow-inner border border-gray-200 mb-6", children: [_jsxs("div", { className: "flex justify-between mb-3", children: [_jsx("span", { className: "text-gray-500", children: "Candidate Name:" }), _jsx("span", { className: "font-medium text-gray-800", children: formData.fullName || "—" })] }), _jsxs("div", { className: "flex justify-between mb-3", children: [_jsx("span", { className: "text-gray-500", children: "Email Address:" }), _jsx("span", { className: "font-medium text-gray-800", children: formData.email || "—" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Amount:" }), _jsx("span", { className: "font-bold text-green-700", children: "\u20A65,000.00" })] })] }), _jsx("button", { onClick: () => initializePayment(onSuccess, onClose), disabled: isProcessing, className: `w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300
          ${isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"}`, children: isProcessing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin h-5 w-5" }), "Processing..."] })) : (_jsxs(_Fragment, { children: [_jsx(CreditCard, { className: "h-5 w-5" }), "Pay with Paystack"] })) }), _jsxs("div", { className: "flex items-center gap-2 mt-6 text-gray-500 text-sm", children: [_jsx(ShieldCheck, { className: "h-5 w-5 text-green-600" }), _jsx("p", { children: "Transactions are 100% secure and encrypted." })] })] }));
};
export default PaymentStep;
