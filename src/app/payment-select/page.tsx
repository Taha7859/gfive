"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { FaCcPaypal } from "react-icons/fa";

interface OrderData {
  _id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  userName: string;
  userEmail: string;
  requirement: string;
  status: string;
  createdAt: string;
}

export default function PaymentSelectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null); // 'stripe' or 'paypal'
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Invalid order. Please fill the form again.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/confirm-order?orderId=${orderId}`);
        const data = await res.json();
        
        if (data.success && data.order) {
          setOrderData(data.order);
          
          // Agar order already paid hai to success page redirect
          if (data.order.status === 'paid') {
            router.push(`/success?order_id=${orderId}`);
          }
        } else {
          setError(data.message || "Order not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const handleStripePayment = async () => {
    if (!orderId || processing) return;
    
    setProcessing("stripe");
    setError("");

    try {
      const res = await fetch("/api/create-stripe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      
      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || "Failed to initiate Stripe payment");
        setProcessing(null);
      }
    } catch (err) {
      console.error("Stripe error:", err);
      setError("Payment service error. Please try again.");
      setProcessing(null);
    }
  };

  const handlePayPalPayment = async () => {
    if (!orderId || processing) return;
    
    setProcessing("paypal");
    setError("");

    try {
      const res = await fetch("/api/create-paypal-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      
      if (data.success && data.approveUrl) {
        // Redirect to PayPal approval URL
        window.location.href = data.approveUrl;
      } else {
        setError(data.message || "Failed to initiate PayPal payment");
        setProcessing(null);
      }
    } catch (err) {
      console.error("PayPal error:", err);
      setError("Payment service error. Please try again.");
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[120px] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen pt-[120px] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Unable to load order details"}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Choose your preferred payment method to complete the order
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderData.status === 'payment_pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {orderData.status === 'payment_pending' ? 'Payment Pending' : orderData.status}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium">{orderData.productTitle}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Customer</span>
                  <span className="font-medium">{orderData.userName}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{orderData.userEmail}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">
                    {new Date(orderData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium text-sm">{orderId}</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
                  <p className="text-gray-600 text-sm">
                    Your payment information is encrypted and secure. We do not store your credit card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-24">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Total Amount</h3>
                <div className="text-3xl font-bold">${orderData.productPrice.toFixed(2)}</div>
                <p className="text-gray-500 text-sm mt-1">USD</p>
              </div>

              <div className="space-y-4">
                {/* Stripe Option */}
                <button
                  onClick={handleStripePayment}
                  disabled={!!processing}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${processing === 'stripe' ? 'bg-gray-100' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                        <CreditCard className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900">Credit/Debit Card</h4>
                        <p className="text-sm text-gray-500">Visa, MasterCard, Amex</p>
                      </div>
                    </div>
                    {processing === 'stripe' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    ) : (
                      <CheckCircle className="h-5 w-5 text-gray-300 group-hover:text-gray-400" />
                    )}
                  </div>
                </button>

                {/* PayPal Option */}
                <button
                  onClick={handlePayPalPayment}
                  disabled={!!processing}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${processing === 'paypal' ? 'bg-blue-100' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                        <FaCcPaypal  className="h-5 w-5 " />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900">PayPal</h4>
                        <p className="text-sm text-gray-500">Fast and secure</p>
                      </div>
                    </div>
                    {processing === 'paypal' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    ) : (
                      <CheckCircle className="h-5 w-5 text-gray-300 group-hover:text-blue-400" />
                    )}
                  </div>
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                  All payments are processed securely.
                </p>
              </div>

              <button
                onClick={() => router.back()}
                className="w-full mt-4 text-center text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Back to order details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}