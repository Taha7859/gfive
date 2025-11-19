"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/SessionProviderWrapper";

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
  };
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

  // ✅ Enable button only when both fields are filled
  useEffect(() => {
    setIsButtonDisabled(!(user.email.trim() && user.password.trim()));
  }, [user]);

  // ✅ Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await axios.post<LoginResponse>("/api/users/login", user);
      toast.success("✅ Login successful!");

      await refreshUser();

      const loggedUser = res.data.user;
      if (loggedUser?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirect || "/");
      }
    } catch (err: unknown) {
      let msg = "Invalid email or password. Please try again.";

      if (axios.isAxiosError(err)) {
        msg = (err.response?.data as { message?: string })?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message || msg;
      }

      if (msg.toLowerCase().includes("invalid")) {
        msg = "❌ Invalid email or password. Please try again.";
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-5xl w-full bg-[#1f1b2e] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        {/* LEFT SECTION - Bigger Premium Card */}
<div className="hidden md:flex items-center justify-center relative p-6">

  <div
    className="w-[95%] h-[500px] rounded-2xl overflow-hidden shadow-xl relative bg-cover bg-center"
    style={{
      backgroundImage: "url('/signup.png')",
    }}
  >
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>

    {/* Content */}
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
      
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="bg-white/15 px-4 py-2 rounded-full text-sm text-white self-start hover:bg-white/25 transition"
      >
        ← Back to website
      </button>

      {/* Text */}
      <div>
        <h1 className="text-4xl font-bold text-white leading-snug">
          We’re here to help <br /> your ideas take shape.
        </h1>

        <p className="text-lg text-white/85 mt-4 max-w-xs">
          Connect with our team anytime - quick, responsive, and ready to start your project today.
        </p>
      </div>
    </div>
  </div>
</div>


        {/* Right Section */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-10">
          <h2 className="text-3xl font-semibold text-white mb-2">
            {loading ? "Processing..." : "Login to your account"}
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#9f7aea] hover:underline">
              Sign up
            </Link>
          </p>

          {/* ✅ Error message box */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg px-4 py-2 mb-4 text-sm text-center animate-pulse">
              {errorMessage}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-[#2b2738] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9f7aea]"
              required
            />
            <button
              type="submit"
              disabled={isButtonDisabled || loading}
              className={`w-full font-medium rounded-lg py-3 transition ${
                isButtonDisabled
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#9f7aea] hover:bg-[#805ad5]"
              } text-white`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
