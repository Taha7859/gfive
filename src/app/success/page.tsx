"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [message, setMessage] = useState("");
  
  // ✅ STRICT FIX: Multiple guards against duplicate calls
  const emailSentRef = useRef(false);
  const isProcessingRef = useRef(false);

  // ✅ FIX 1: useCallback mein wrap kiya taaki useEffect dependency issue solve ho
  const sendConfirmationEmail = useCallback(async () => {
    try {
      setEmailStatus("sending");
      setMessage("Sending confirmation email...");
      
      const response = await fetch("/api/confirm-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          sessionId: sessionId,
          orderId: orderId 
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        setEmailStatus("sent");
        setMessage("Order confirmed! Check your email for details.");
      } else {
        setEmailStatus("failed");
        setMessage(data.message || "Email confirmation failed.");
      }
    } catch (error) {
      console.error("Email sending error:", error);
      setEmailStatus("failed");
      setMessage("Network error. We&apos;ll contact you shortly.");
    }
  }, [sessionId, orderId]);

  useEffect(() => {
    const triggerEmail = async () => {
      // ✅ Check all conditions
      if (!sessionId && !orderId) return;
      if (emailSentRef.current) return;
      if (isProcessingRef.current) return;
      
      isProcessingRef.current = true;
      emailSentRef.current = true;
      
      console.log("🚀 Triggering email for:", { sessionId, orderId });
      await sendConfirmationEmail();
      isProcessingRef.current = false;
    };

    triggerEmail();
  }, [sessionId, orderId, sendConfirmationEmail]); // ✅ FIX: sendConfirmationEmail ko dependency mein add kiya

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-8 pt-24">
      <div className="max-w-2xl w-full">
        {/* Animated Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 transform transition-all duration-500 hover:shadow-3xl">
          
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
            
            {/* Success Icon */}
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
              <p className="text-green-100 text-lg opacity-90">Thank you for your order</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Order Summary
              </h2>
              
              <div className="space-y-3">
                {sessionId && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Session ID:</span>
                    <span className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {sessionId.substring(0, 12)}...
                    </span>
                  </div>
                )}
                {orderId && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {orderId.substring(0, 12)}...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Email Status */}
            <div className="mb-8">
              <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                emailStatus === "idle" ? "bg-blue-50 border-blue-200" :
                emailStatus === "sending" ? "bg-yellow-50 border-yellow-200" :
                emailStatus === "sent" ? "bg-green-50 border-green-200" :
                "bg-red-50 border-red-200"
              }`}>
                
                {emailStatus === "idle" && (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="text-blue-800 font-semibold">Preparing your order</p>
                      <p className="text-blue-600 text-sm">Getting everything ready...</p>
                    </div>
                  </div>
                )}
                
                {emailStatus === "sending" && (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="text-yellow-800 font-semibold">Sending confirmation</p>
                      <p className="text-yellow-600 text-sm">Almost there...</p>
                    </div>
                  </div>
                )}
                
                {emailStatus === "sent" && (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-semibold">Confirmation sent!</p>
                      <p className="text-green-600 text-sm">Check your email for details</p>
                    </div>
                  </div>
                )}
                
                {emailStatus === "failed" && (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-800 font-semibold">Email not sent</p>
                      <p className="text-red-600 text-sm">{message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                What&apos;s Next?
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Check your email for order confirmation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  We&apos;ll review your requirements within 24 hours
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Our team will contact you for next steps
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link 
                href="/"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Continue Shopping
              </Link>
              
              <button
                onClick={sendConfirmationEmail}
                disabled={emailStatus === "sending" || emailStatus === "sent"}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {emailStatus === "sent" ? "Email Sent ✓" : "Resend Email"}
              </button>
            </div>

            {/* Support Info */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Need help?{" "}
                <a href="/contact" className="text-green-600 hover:text-green-700 font-semibold">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Celebration Elements */}
        <div className="fixed top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
        <div className="fixed top-20 right-20 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-40"></div>
        <div className="fixed bottom-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-50"></div>
      </div>
    </div>
  );
}