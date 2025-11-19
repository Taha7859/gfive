"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const username = `${firstName.trim()} ${lastName.trim()}`;

    if (!validateEmail(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be 8+ chars, include upper/lowercase, number & special char"
      );
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
        setError(data.message || "Something went wrong");
      } else {
        setSuccess("Account created! Check your email to verify.");
        setTimer(30); // 30 sec countdown
        setResendEnabled(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
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

      if (!res.ok) throw new Error(data.error || "Resend failed");

      setSuccess("Verification email resent successfully!");
      setTimer(data.expiresIn || 30); // reset timer from backend
      setResendEnabled(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
      setResendEnabled(true); // enable button if backend failed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-5xl w-full bg-[#1f1b2e] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left */}
        {/* LEFT SECTION - Premium Big Card */}
<div className="hidden md:flex items-center justify-center relative p-6">

  <div
    className="w-[95%] h-[500px] rounded-2xl overflow-hidden shadow-xl relative bg-cover bg-center"
    style={{
      backgroundImage: "url('/signup.png')", // apni image yaha rakho
    }}
  >
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>

    {/* Content */}
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
      
      {/* Back button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="bg-white/15 px-4 py-2 rounded-full text-sm text-white self-start hover:bg-white/25 transition"
      >
        ← Back to website
      </button>

      {/* Text */}
      <div>
        <h1 className="text-4xl font-bold text-white leading-snug">
          Join the  journey <br /> today.
        </h1>

        <p className="text-lg text-white/85 mt-4 max-w-xs">
          Create your account and start exploring premium features crafted for your growth.
        </p>
      </div>
    </div>
  </div>
</div>


        {/* Right - Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-10">
          <h2 className="text-3xl font-semibold text-white mb-2">
            Create an account
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[#9f7aea] hover:underline">
              Log in
            </Link>
          </p>

          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-2 text-center">{success}</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea]"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea]"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea]"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea]"
              required
            />

            <div className="flex items-center text-gray-300 text-sm">
              <input
                id="terms"
                type="checkbox"
                className="mr-2 accent-[#9f7aea]"
                required
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link href="/terms" className="text-[#9f7aea] hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9f7aea] text-white font-medium rounded-lg py-3 hover:bg-[#805ad5] transition"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          {/* Resend Verification */}
          {success && (
            <div className="mt-5 text-center">
              {timer > 0 && (
                <p className="text-sm text-gray-400 mb-2">
                  You can resend email in{" "}
                  <span className="text-[#9f7aea] font-medium">
                    {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
                  </span>
                </p>
              )}
              <button
                onClick={handleResend}
                disabled={!resendEnabled}
                className={`w-full py-2 rounded-lg font-medium text-white transition ${
                  resendEnabled
                    ? "bg-[#9f7aea] hover:bg-[#805ad5]"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                Resend Verification Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
