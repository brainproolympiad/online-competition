import React, { useEffect, useState } from "react";
import { ShieldCheck, CreditCard, Loader2, CheckCircle } from "lucide-react";

const PaymentStep = ({ formData, setFormData, setStepValid }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success', 'failed'
    const publicKey = import.meta.env.VITE_PAYSTACK_KEY;

    // ✅ Check if already paid when entering this step
    useEffect(() => {
        console.log("🔄 PaymentStep useEffect - formData.paid:", formData.paid);
        if (formData.paid) {
            console.log("✅ Payment already completed, enabling step");
            setStepValid(true);
            setPaymentStatus('success');
        } else {
            setStepValid(false);
            setPaymentStatus('idle');
        }
    }, [formData.paid, setStepValid]);

    // Load Paystack script
    useEffect(() => {
        if (!window.PaystackPop) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            script.onload = () => {
                console.log("✅ Paystack script loaded");
            };
            document.body.appendChild(script);
        }
    }, []);

    const initializePayment = () => {
        if (!publicKey || publicKey === "undefined") {
            console.error("❌ Paystack public key not configured");
            return;
        }

        if (!formData.email || !formData.fullName) {
            console.error("❌ Missing email or full name");
            return;
        }

        console.log("💰 Initializing Paystack payment...");
        setIsProcessing(true);
        setPaymentStatus('processing');

        // Use Paystack's inline implementation directly
        const handler = window.PaystackPop.setup({
            key: publicKey,
            email: formData.email,
            amount: 5000 * 100, // ₦5,000 in kobo
            ref: 'PS_' + Math.floor((Math.random() * 1000000000) + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Candidate Name",
                        variable_name: "candidate_name",
                        value: formData.fullName
                    }
                ]
            },
            callback: function(response) {
                console.log("✅ Paystack payment success:", response);
                handlePaymentSuccess(response);
            },
            onClose: function() {
                console.log("❎ Paystack payment window closed by user");
                setIsProcessing(false);
                setPaymentStatus('idle');
            }
        });

        // Open in new tab/window instead of iframe to avoid blocking
        handler.openIframe();
    };

    const handlePaymentSuccess = (response) => {
        console.log("💰 Payment success processing...");
        
        // IMMEDIATELY update the state
        const updatedData = {
            ...formData,
            paid: true,
            paymentRef: response.reference,
            paymentDate: new Date().toISOString(),
            paymentStatus: 'completed'
        };
        
        console.log("🔄 Updating formData with paid: true");
        setFormData(updatedData);
        
        console.log("✅ Setting stepValid to true");
        setStepValid(true);
        setPaymentStatus('success');
        setIsProcessing(false);

        console.log("🎯 Payment state updated successfully");

        // Save to backend in background
        saveRegistration(updatedData);
    };

    const saveRegistration = async (data) => {
        try {
            console.log("📦 Saving registration to backend...");
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            
            if (res.ok) {
                const result = await res.json();
                console.log("✅ Registration saved to backend:", result);
            } else {
                console.error("❌ Failed to save registration");
            }
        } catch (err) {
            console.error("❌ Error submitting data:", err);
        }
    };

    // If already paid, show success message
    if (formData.paid || paymentStatus === 'success') {
        return React.createElement(
            "div",
            { className: "flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-green-50 to-green-100 rounded-2xl shadow-lg max-w-xl mx-auto border border-green-200" },
            [
                React.createElement(
                    "div",
                    { className: "flex items-center gap-3 mb-6", key: "header" },
                    [
                        React.createElement(CheckCircle, { className: "text-green-600 h-8 w-8", key: "icon" }),
                        React.createElement("h2", { className: "text-2xl font-bold text-gray-800", key: "title" }, "Payment Complete")
                    ]
                ),
                React.createElement(
                    "div",
                    { className: "w-full bg-white rounded-xl p-6 shadow-inner border border-green-200 mb-6", key: "details" },
                    [
                        React.createElement(
                            "div",
                            { className: "text-center mb-4", key: "success-message" },
                            [
                                React.createElement(CheckCircle, { className: "text-green-500 h-16 w-16 mx-auto mb-3", key: "success-icon" }),
                                React.createElement("h3", { className: "text-xl font-bold text-green-700 mb-2", key: "success-title" }, "Payment Successful!"),
                                React.createElement("p", { className: "text-gray-600", key: "success-text" }, "Your payment has been processed successfully.")
                            ]
                        ),
                        React.createElement(
                            "div",
                            { className: "space-y-3 text-sm", key: "payment-info" },
                            [
                                React.createElement(
                                    "div",
                                    { className: "flex justify-between", key: "reference" },
                                    [
                                        React.createElement("span", { className: "text-gray-500", key: "label1" }, "Reference:"),
                                        React.createElement("span", { className: "font-mono text-gray-800", key: "value1" }, formData.paymentRef || "N/A")
                                    ]
                                ),
                                React.createElement(
                                    "div",
                                    { className: "flex justify-between", key: "amount" },
                                    [
                                        React.createElement("span", { className: "text-gray-500", key: "label2" }, "Amount:"),
                                        React.createElement("span", { className: "font-bold text-green-700", key: "value2" }, "₦5,000.00")
                                    ]
                                ),
                                React.createElement(
                                    "div",
                                    { className: "flex justify-between", key: "status" },
                                    [
                                        React.createElement("span", { className: "text-gray-500", key: "label3" }, "Status:"),
                                        React.createElement("span", { className: "font-semibold text-green-600", key: "value3" }, "Paid")
                                    ]
                                )
                            ]
                        )
                    ]
                ),
                React.createElement(
                    "p",
                    { className: "text-green-600 font-medium text-center", key: "proceed-message" },
                    "You can now proceed to the next step."
                )
            ]
        );
    }

    // Show processing state
    if (isProcessing || paymentStatus === 'processing') {
        return React.createElement(
            "div",
            { className: "flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl shadow-lg max-w-xl mx-auto border border-blue-200" },
            [
                React.createElement(
                    "div",
                    { className: "flex items-center gap-3 mb-6", key: "header" },
                    [
                        React.createElement(CreditCard, { className: "text-blue-600 h-8 w-8", key: "icon" }),
                        React.createElement("h2", { className: "text-2xl font-bold text-gray-800", key: "title" }, "Processing Payment")
                    ]
                ),
                React.createElement(
                    "div",
                    { className: "w-full bg-white rounded-xl p-6 shadow-inner border border-blue-200 mb-6 text-center", key: "processing" },
                    [
                        React.createElement(Loader2, { className: "animate-spin h-12 w-12 text-blue-600 mx-auto mb-4", key: "spinner" }),
                        React.createElement("p", { className: "text-gray-600 mb-2", key: "text1" }, "Processing your payment..."),
                        React.createElement("p", { className: "text-sm text-gray-500", key: "text2" }, "Please wait while we securely process your transaction.")
                    ]
                )
            ]
        );
    }

    // Normal payment UI
    return React.createElement(
        "div",
        { className: "flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-lg max-w-xl mx-auto border border-gray-200" },
        [
            React.createElement(
                "div",
                { className: "flex items-center gap-3 mb-6", key: "header" },
                [
                    React.createElement(CreditCard, { className: "text-blue-600 h-8 w-8", key: "icon" }),
                    React.createElement("h2", { className: "text-2xl font-bold text-gray-800", key: "title" }, "Step 5: Payment")
                ]
            ),
            React.createElement(
                "p",
                { className: "text-gray-600 text-center max-w-md mb-8", key: "description" },
                [
                    "Please complete your payment of ",
                    React.createElement("span", { className: "font-semibold text-blue-700", key: "amount" }, "₦5,000"),
                    " to finalize your registration. Your payment is securely processed by ",
                    React.createElement("span", { className: "font-bold text-green-600", key: "processor" }, "Paystack"),
                    "."
                ]
            ),
            React.createElement(
                "div",
                { className: "w-full bg-white rounded-xl p-6 shadow-inner border border-gray-200 mb-6", key: "details" },
                [
                    React.createElement(
                        "div",
                        { className: "flex justify-between mb-3", key: "name" },
                        [
                            React.createElement("span", { className: "text-gray-500", key: "label1" }, "Candidate Name:"),
                            React.createElement("span", { className: "font-medium text-gray-800", key: "value1" }, formData.fullName || "—")
                        ]
                    ),
                    React.createElement(
                        "div",
                        { className: "flex justify-between mb-3", key: "email" },
                        [
                            React.createElement("span", { className: "text-gray-500", key: "label2" }, "Email Address:"),
                            React.createElement("span", { className: "font-medium text-gray-800", key: "value2" }, formData.email || "—")
                        ]
                    ),
                    React.createElement(
                        "div",
                        { className: "flex justify-between", key: "amount-display" },
                        [
                            React.createElement("span", { className: "text-gray-500", key: "label3" }, "Amount:"),
                            React.createElement("span", { className: "font-bold text-green-700", key: "value3" }, "₦5,000.00")
                        ]
                    )
                ]
            ),
            React.createElement(
                "button",
                {
                    onClick: initializePayment,
                    disabled: isProcessing || !publicKey || publicKey === "undefined" || !formData.email || !formData.fullName,
                    className: `w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        isProcessing || !publicKey || publicKey === "undefined" || !formData.email || !formData.fullName
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                    }`,
                    key: "button"
                },
                isProcessing ? (
                    React.createElement(React.Fragment, { key: "processing" }, [
                        React.createElement(Loader2, { className: "animate-spin h-5 w-5", key: "spinner" }),
                        "Processing..."
                    ])
                ) : (
                    React.createElement(React.Fragment, { key: "pay" }, [
                        React.createElement(CreditCard, { className: "h-5 w-5", key: "card-icon" }),
                        "Pay with Paystack"
                    ])
                )
            ),
            React.createElement(
                "div",
                { className: "flex items-center gap-2 mt-6 text-gray-500 text-sm", key: "security" },
                [
                    React.createElement(ShieldCheck, { className: "h-5 w-5 text-green-600", key: "shield" }),
                    React.createElement("p", { key: "text" }, "Transactions are 100% secure and encrypted.")
                ]
            )
        ]
    );
};

export default PaymentStep;