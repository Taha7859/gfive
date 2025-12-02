"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaLock, FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // ✅ Password requirement checks
  const passwordRequirements = {
    length: password.length >= 6,
    number: /\d/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0,
  };

  // ✅ Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid reset link");
        setTokenLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/users/verify-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Invalid or expired reset link");
        } else {
          setTokenValid(true);
        }
      } catch (err) {
        setError("Failed to verify reset link");
      } finally {
        setTokenLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!passwordRequirements.match) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="max-w-md w-full bg-[#1f1b2e] rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-[#9f7aea] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="max-w-md w-full bg-[#1f1b2e] rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimes className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Invalid Reset Link
            </h2>
            <p className="text-gray-300 mb-6">
              {error || "This password reset link is invalid or has expired."}
            </p>
            <div className="space-y-3">
              <Link
                href="/forgot-password"
                className="block w-full bg-[#9f7aea] text-white font-medium rounded-lg py-3 hover:bg-[#805ad5] transition text-center"
              >
                Get New Reset Link
              </Link>
              <Link
                href="/login"
                className="block w-full border border-gray-600 text-gray-300 font-medium rounded-lg py-3 hover:bg-gray-800 transition text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="max-w-md w-full bg-[#1f1b2e] rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Password Reset Successfully!
            </h2>
            <p className="text-gray-300 mb-6">
              Your password has been updated successfully. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-[#9f7aea] text-white font-medium rounded-lg py-3 hover:bg-[#805ad5] transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-[#1f1b2e] rounded-2xl shadow-2xl p-8">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <h2 className="text-3xl font-semibold text-white mb-2">
          Set New Password
        </h2>
        <p className="text-gray-400 mb-6">
          Create a new password for your account.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="p-3 bg-[#2b2738] rounded-lg">
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
                <div className="flex items-center text-sm">
                  {passwordRequirements.match ? (
                    <FaCheck className="text-green-400 mr-2" />
                  ) : (
                    <FaTimes className="text-red-400 mr-2" />
                  )}
                  <span className={passwordRequirements.match ? "text-green-400" : "text-gray-400"}>
                    Passwords match
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !passwordRequirements.match || !passwordRequirements.length || !passwordRequirements.number}
            className={`w-full font-medium rounded-lg py-3.5 transition-all duration-200 ${
              loading || !passwordRequirements.match || !passwordRequirements.length || !passwordRequirements.number
                ? "bg-gray-600 cursor-not-allowed transform scale-95"
                : "bg-[#9f7aea] hover:bg-[#805ad5] transform hover:scale-[1.02] shadow-lg hover:shadow-[#9f7aea]/25"
            } text-white flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}