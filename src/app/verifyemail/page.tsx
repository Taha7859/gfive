"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying...");
  const [userEmail, setUserEmail] = useState<string | null>(null); // ✅ FIXED

  const verifyEmail = useCallback(async (): Promise<void> => {
    if (!token) {
      setStatus("error");
      setMessage("No token found in URL.");
      return;
    }

    try {
      const res = await fetch("/api/users/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Email verified successfully. Redirecting...");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setStatus("error");
        setMessage(data.error || "Verification failed.");

        // ✅ Backend returns user email, not userId
        if (data.canResend) {
          setUserEmail(data.email); // ✅ FIXED
        }
      }
    } catch {
      setStatus("error");
      setMessage("Network error — try again later.");
    }
  }, [router, token]);

  const resendVerification = async (): Promise<void> => {
    if (!userEmail) return;

    try {
      const res = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }), // ✅ FIXED
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Verification email resent! Check your inbox.");
      } else {
        setMessage(data.error || "Failed to resend email.");
      }
    } catch {
      setMessage("Network error — try again later.");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f1b2e] text-white p-4">
      <div className="bg-[#2b2738] p-8 rounded-2xl shadow-lg w-full max-w-xl text-center">
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin mx-auto text-[#9f7aea]" size={48} />
            <h2 className="text-xl mt-6 text-gray-300">Verifying your email...</h2>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-400" size={64} />
            <h2 className="text-2xl font-semibold mt-6 text-green-400">Email Verified</h2>
            <p className="text-gray-300 mt-2">{message}</p>
            <p className="mt-4 text-sm text-gray-400">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500" size={64} />
            <h2 className="text-2xl font-semibold mt-6 text-red-400">Verification Failed</h2>
            <p className="text-gray-300 mt-2">{message}</p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => router.push("/signup")}
                className="bg-[#9f7aea] px-4 py-2 rounded hover:bg-[#805ad5] transition"
              >
                Back to signup
              </button>

              {userEmail && (
                <button
                  onClick={resendVerification}
                  className="bg-[#444] px-4 py-2 rounded hover:bg-[#555] transition"
                >
                  Resend Verification Email
                </button>
              )}

              <button
                onClick={() => window.location.reload()}
                className="bg-[#666] px-4 py-2 rounded hover:bg-[#777] transition"
              >
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
