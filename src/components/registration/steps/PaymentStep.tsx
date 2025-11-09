// PaymentStep.tsx
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { ShieldCheck, CreditCard, Loader2, CheckCircle } from "lucide-react";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setStepValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentStep: React.FC<Props> = ({ formData, setFormData, setStepValid }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const publicKey = import.meta.env.VITE_PAYSTACK_KEY;

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: 50 * 100, // ₦5,000 in kobo (corrected from 50*10 to 50*100)
    publicKey,
  };

  const initializePayment = usePaystackPayment(config);

  // ✅ Watch for formData.paid changes and update step validity
  useEffect(() => {
    if (formData.paid) {
      setStepValid(true);
    } else {
      setStepValid(false);
    }
  }, [formData.paid, setStepValid]);

  const onSuccess = async (reference: any) => {
    setIsProcessing(true);
    console.log("✅ Payment success:", reference);

    const updatedData = {
      ...formData,
      paid: true,
      paymentRef: reference.reference,
      paymentDate: new Date().toISOString(),
    };
    
    // Update form data immediately
    setFormData(updatedData);
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();
      if (result.success) {
        console.log("🎉 Payment and registration successful!");
      } else {
        console.error("⚠️ Payment succeeded but registration failed to save.");
      }
    } catch (err) {
      console.error("❌ Error submitting data:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    console.log("❎ Payment window closed.");
    setIsProcessing(false);
  };

  // If already paid, show success message
  if (formData.paid) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-green-50 to-green-100 rounded-2xl shadow-lg max-w-xl mx-auto border border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="text-green-600 h-8 w-8" />
          <h2 className="text-2xl font-bold text-gray-800">Payment Complete</h2>
        </div>

        <div className="w-full bg-white rounded-xl p-6 shadow-inner border border-green-200 mb-6">
          <div className="text-center mb-4">
            <CheckCircle className="text-green-500 h-16 w-16 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-700 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Your payment has been processed successfully.</p>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Reference:</span>
              <span className="font-mono text-gray-800">{formData.paymentRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount:</span>
              <span className="font-bold text-green-700">₦5,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-semibold text-green-600">Paid</span>
            </div>
          </div>
        </div>

        <p className="text-green-600 font-medium text-center">
          You can now proceed to the next step.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-lg max-w-xl mx-auto border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-blue-600 h-8 w-8" />
        <h2 className="text-2xl font-bold text-gray-800">Step 5: Payment</h2>
      </div>

      <p className="text-gray-600 text-center max-w-md mb-8">
        Please complete your payment of{" "}
        <span className="font-semibold text-blue-700">₦5,000</span> to finalize
        your registration. Your payment is securely processed by{" "}
        <span className="font-bold text-green-600">Paystack</span>.
      </p>

      <div className="w-full bg-white rounded-xl p-6 shadow-inner border border-gray-200 mb-6">
        <div className="flex justify-between mb-3">
          <span className="text-gray-500">Candidate Name:</span>
          <span className="font-medium text-gray-800">{formData.fullName || "—"}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-gray-500">Email Address:</span>
          <span className="font-medium text-gray-800">{formData.email || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Amount:</span>
          <span className="font-bold text-green-700">₦5,000.00</span>
        </div>
      </div>

      <button
        onClick={() => initializePayment(onSuccess, onClose)}
        disabled={isProcessing}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300
          ${isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
          }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay with Paystack
          </>
        )}
      </button>

      <div className="flex items-center gap-2 mt-6 text-gray-500 text-sm">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <p>Transactions are 100% secure and encrypted.</p>
      </div>
    </div>
  );
};

export default PaymentStep;