import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { ShieldCheck, CreditCard, Loader2 } from "lucide-react";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setStepValid: React.Dispatch<React.SetStateAction<boolean>>; // ✅ add this prop
}

const PaymentStep: React.FC<Props> = ({ formData, setFormData, setStepValid }) => {
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
      } else {
        alert("⚠️ Payment succeeded but registration failed to save.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting data. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    console.log("❎ Payment window closed.");
  };

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
