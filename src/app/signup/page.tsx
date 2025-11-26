"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && success !== "") {
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [timer, success]);

  // ✅ NEW: Simple validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => /^(?=.*\d).{6,}$/.test(password);

  // ✅ NEW: Password requirement checks for UI
  const passwordRequirements = {
    length: password.length >= 6,
    number: /\d/.test(password),
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const username = `${firstName.trim()} ${lastName.trim()}`;

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long and contain at least 1 number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        setSuccess("Account created successfully! Please check your email to verify your account.");
        setTimer(30);
        setResendEnabled(false);
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      }
    } catch {
      // ✅ FIXED: Removed unused 'err' parameter
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!email) return;
    setError("");
    setSuccess("");
    setResendEnabled(false);

    try {
      const res = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to resend email");

      setSuccess("Verification email sent successfully!");
      setTimer(data.expiresIn || 30);
      setResendEnabled(false);
    } catch {
      // ✅ FIXED: Removed unused 'err' parameter
      setError("Failed to resend email. Please try again.");
      setResendEnabled(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-5xl w-full bg-[#1f1b2e] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Section - Premium Card */}
        <div className="hidden md:flex items-center justify-center relative p-6">
          <div
            className="w-[95%] h-[500px] rounded-2xl overflow-hidden shadow-xl relative bg-cover bg-center"
            style={{
              backgroundImage: "url('/signup.png')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
            
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-white/15 px-4 py-2 rounded-full text-sm text-white self-start hover:bg-white/25 transition backdrop-blur-sm"
              >
                ← Back to home
              </button>

              <div>
                <h1 className="text-4xl font-bold text-white leading-snug">
                  Start Your Journey <br />With Us Today
                </h1>
                <p className="text-lg text-white/85 mt-4 max-w-xs">
                  Create your account and unlock exclusive features designed for your success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-10">
          <h2 className="text-3xl font-semibold text-white mb-2">
            Create Account
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[#9f7aea] hover:underline font-medium">
              Sign in here
            </Link>
          </p>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                  required
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>

              {/* ✅ NEW: Password Requirements Indicator */}
              {password && (
                <div className="mt-2 p-3 bg-[#2b2738] rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Password requirements:</p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      {passwordRequirements.length ? (
                        <FaCheck className="text-green-400 mr-2" />
                      ) : (
                        <FaTimes className="text-red-400 mr-2" />
                      )}
                      <span className={passwordRequirements.length ? "text-green-400" : "text-gray-400"}>
                        At least 6 characters
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {passwordRequirements.number ? (
                        <FaCheck className="text-green-400 mr-2" />
                      ) : (
                        <FaTimes className="text-red-400 mr-2" />
                      )}
                      <span className={passwordRequirements.number ? "text-green-400" : "text-gray-400"}>
                        At least 1 number
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 text-gray-300 text-sm">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 accent-[#9f7aea]"
                required
              />
              <label htmlFor="terms" className="leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[#9f7aea] hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#9f7aea] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9f7aea] text-white font-medium rounded-lg py-3 hover:bg-[#805ad5] disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Resend Verification Section */}
          {success && (
            <div className="mt-6 p-4 bg-[#2b2738] rounded-lg">
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-gray-400 mb-3">
                    Resend available in{" "}
                    <span className="text-[#9f7aea] font-medium">
                      {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mb-3">
                    {/* ✅ FIXED: Escaped apostrophe */}
                    Didn&apos;t receive the email?
                  </p>
                )}
                <button
                  onClick={handleResend}
                  disabled={!resendEnabled}
                  className={`w-full py-2 rounded-lg font-medium text-white transition ${
                    resendEnabled
                      ? "bg-[#9f7aea] hover:bg-[#805ad5] transform hover:scale-[1.02]"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  Resend Verification Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}