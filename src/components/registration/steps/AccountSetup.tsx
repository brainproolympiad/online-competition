import React, { useState, useEffect } from "react";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setStepValid?: (valid: boolean) => void; // Optional for StepNavigation validation
}

const AccountSetup: React.FC<Props> = ({ formData, setFormData, setStepValid }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  // ✅ Generate Strong Password Suggestion
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:<>?";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password, confirmPassword: "" });
    checkPasswordStrength(password);
  };

  // ✅ Copy Password to Clipboard
  const copyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ Password Strength Logic
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    checkPasswordStrength(password);
  };

  // ✅ Dynamic Validation
  useEffect(() => {
    if (!setStepValid) return;
    const { username, email, password, confirmPassword } = formData;
    const isValid =
      username?.length >= 3 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password?.length >= 8 &&
      password === confirmPassword;
    setStepValid(isValid);
  }, [formData]);

  // ✅ Strength UI helpers
  const getPasswordStrengthText = () => {
    if (formData.password.length === 0) return "";
    switch (passwordStrength) {
      case 1: return "Very Weak";
      case 2: return "Weak";
      case 3: return "Medium";
      case 4: return "Strong";
      default: return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
        Step 4: Account Setup
      </h2>

      <div className="space-y-6">
        {/* Username Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Username *
          </label>
          <input
            type="text"
            placeholder="Choose a username"
            value={formData.username || ""}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Use 3+ characters (letters, numbers, underscores).
          </p>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Email Address *
          </label>
          <input
            type="email"
            placeholder="Your email address"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            We'll send a confirmation email to this address.
          </p>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password || ""}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-24"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5
                      c4.478 0 8.268 2.943 9.542 7
                      -1.274 4.057-5.064 7-9.542 7
                      -4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19
                      c-4.478 0-8.268-2.943-9.543-7
                      a9.97 9.97 0 011.563-3.029m5.858.908
                      a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                onClick={generatePassword}
              >
                Suggest
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Strength:{" "}
                  <span
                    className={`${
                      passwordStrength === 1
                        ? "text-red-600"
                        : passwordStrength === 2
                        ? "text-orange-600"
                        : passwordStrength === 3
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </span>

                <button
                  onClick={copyPassword}
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16h8m-8-4h8m-8-4h8m-2 12H6a2 2 0 01-2-2V6
                      a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2z" />
                  </svg>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword || ""}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-12"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {formData.password && formData.confirmPassword && (
            <p
              className={`text-sm mt-1 ${
                formData.password === formData.confirmPassword
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formData.password === formData.confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;
