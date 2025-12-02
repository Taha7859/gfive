"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/SessionProviderWrapper";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";

interface UserData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    isVerified?: boolean;
  };
}

// ✅ Added interface for error response
interface ErrorResponse {
  message?: string;
  requiresVerification?: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { refreshUser } = useAuth();

  const [user, setUser] = useState<UserData>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);

  // ✅ Enable button only when both fields are properly filled
  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
    const isPasswordValid = user.password.length >= 6;
    setIsButtonDisabled(!(isEmailValid && isPasswordValid));
  }, [user]);

  // ✅ Handle login WITH TAB SYNC
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setShowResendVerification(false);

    try {
      const res = await axios.post<LoginResponse>("/api/users/login", user);
      
      // ✅ TAB SYNC: Ye line missing thi - IMPORTANT!
      localStorage.setItem('login', Date.now().toString());
      
      toast.success("Welcome back! Login successful.");
      await refreshUser();

      // ✅ Redirect based on user role
      const loggedUser = res.data.user;
      setTimeout(() => {
        if (loggedUser?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push(redirect);
        }
      }, 1000);

    } catch (err: unknown) {
      let msg = "Invalid email or password. Please try again.";
      let requiresVerification = false;

      if (axios.isAxiosError(err)) {
        // ✅ FIXED: Removed 'any' type and used proper interface
        const responseData = err.response?.data as ErrorResponse;
        msg = responseData?.message || msg;
        requiresVerification = responseData?.requiresVerification || false;
      }

      setErrorMessage(msg);
      
      if (requiresVerification) {
        setShowResendVerification(true);
      }

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Handle resend verification - FIXED: Removed unused 'error' parameter
  const handleResendVerification = async () => {
    try {
      await axios.post("/api/users/resend-verification", { email: user.email });
      toast.success("Verification email sent! Please check your inbox.");
      setShowResendVerification(false);
    } catch {
      // ✅ FIXED: Removed unused 'error' parameter
      toast.error("Failed to resend verification email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
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
                onClick={() => router.push("/")}
                className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white self-start hover:bg-white/25 transition flex items-center gap-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to home
              </button>

              <div>
                <h1 className="text-4xl font-bold text-white leading-snug">
                  Welcome Back to <br />Your Account
                </h1>
                <p className="text-lg text-white/85 mt-4 max-w-xs">
                  Continue your journey with us. Access your personalized dashboard and features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-10">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white mb-2">
              {loading ? "Signing you in..." : "Welcome Back"}
            </h2>
            <p className="text-gray-400 text-sm">
              {/* ✅ FIXED: Escaped apostrophe */}
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="text-[#9f7aea] hover:underline font-medium transition-colors"
              >
                Create account here
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-red-400 text-sm flex-1">{errorMessage}</p>
              </div>
              
              {/* Resend Verification Option */}
              {showResendVerification && (
                <div className="mt-3 pt-3 border-t border-red-500/20">
                  <button
                    onClick={handleResendVerification}
                    className="text-[#9f7aea] hover:text-[#805ad5] text-sm font-medium transition-colors"
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link className="block text-sm font-medium text-gray-300 "  href={"forgot-password"}>ForgotPassword</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea] border border-transparent hover:border-gray-600 transition"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isButtonDisabled || loading}
              className={`w-full font-medium rounded-lg py-3.5 transition-all duration-200 ${
                isButtonDisabled || loading
                  ? "bg-gray-600 cursor-not-allowed transform scale-95"
                  : "bg-[#9f7aea] hover:bg-[#805ad5] transform hover:scale-[1.02] shadow-lg hover:shadow-[#9f7aea]/25"
              } text-white flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-[#9f7aea] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#9f7aea] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}