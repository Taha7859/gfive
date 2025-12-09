"use client";

import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Product {
  _id: string;
  title: string;
  price: number;
  description?: string;
  image?: string;
}

interface Errors {
  userName: string;
  userEmail: string;
  requirement: string;
  file: string;
  submit?: string;
  fetch?: string;
}

export default function RequirementForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // FORM FIELDS
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [requirement, setRequirement] = useState("");
  const [additional, setAdditional] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // ERRORS
  const [errors, setErrors] = useState<Errors>({
    userName: "",
    userEmail: "",
    requirement: "",
    file: "",
  });

  // -------------------------------
  // Load Product
  // -------------------------------
  useEffect(() => {
    const loadData = async () => {
      if (!productId) return;

      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setErrors((prev) => ({ ...prev, fetch: "Failed to load product." }));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // -------------------------------
  // Validation
  // -------------------------------
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Partial<Errors> = {}; // ✅ TypeScript-friendly

    if (userName.trim().length < 3) {
      newErrors.userName = "Name must be at least 3 characters.";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(userEmail)) {
      newErrors.userEmail = "Enter a valid email address.";
      valid = false;
    }

    if (requirement.trim().length < 10) {
      newErrors.requirement = "Requirement must be at least 10 characters.";
      valid = false;
    }

    if (file) {
      const allowed = ["image/png", "image/jpeg", "application/pdf"];
      if (!allowed.includes(file.type)) {
        newErrors.file = "Only PNG, JPEG, or PDF files allowed.";
        valid = false;
      }
      if (file.size > 5 * 1024 * 1024) {
        newErrors.file = "File size must be under 5MB.";
        valid = false;
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  // -------------------------------
  // Submit Handler - UPDATED
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!validateForm()) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("productId", productId || "");
    formData.append("productTitle", product.title);
    formData.append("productPrice", product.price.toString());
    formData.append("userName", userName);
    formData.append("userEmail", userEmail);
    formData.append("requirement", requirement);
    formData.append("additional", additional);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });

      // ✅ UPDATED: Now handling both paymentSelectUrl and checkoutUrl
      const data: { 
        success: boolean; 
        checkoutUrl?: string; 
        paymentSelectUrl?: string; // New field for payment selection
        orderId?: string;
        message?: string 
      } = await res.json();

      if (data.success) {
        // ✅ Priority: If paymentSelectUrl exists, go to payment selection page
        if (data.paymentSelectUrl) {
          window.location.href = data.paymentSelectUrl;
        } 
        // ✅ Fallback: If checkoutUrl exists (for existing flow), go directly to Stripe
        else if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } 
        else {
          setErrors((prev) => ({
            ...prev,
            submit: data.message || "Something went wrong.",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: data.message || "Something went wrong.",
        }));
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        submit: "Network error. Try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="pt-40 text-center">Loading…</div>;

  if (!product)
    return (
      <div className="pt-40 text-center text-red-500">
        Product not found.
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16 pt-[120px]">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center">Request Custom Package</h1>

        <p className="text-gray-600 text-center mb-4">
          Provide details for <strong>{product.title}</strong>
        </p>

        <p className="text-center text-lg text-gray-800 font-semibold mb-8">
          Price: ${product.price.toFixed(2)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="font-semibold text-gray-800">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md p-3 mt-1"
              aria-invalid={!!errors.userName}
              aria-describedby="name-error"
            />
            {errors.userName && (
              <p id="name-error" className="text-red-600 text-sm mt-1">
                {errors.userName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="font-semibold text-gray-800">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md p-3 mt-1"
              aria-invalid={!!errors.userEmail}
              aria-describedby="email-error"
            />
            {errors.userEmail && (
              <p id="email-error" className="text-red-600 text-sm mt-1">
                {errors.userEmail}
              </p>
            )}
          </div>

          {/* Requirement */}
          <div>
            <label htmlFor="requirement" className="font-semibold text-gray-800">
              Requirement in Detail
            </label>
            <textarea
              id="requirement"
              rows={4}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md p-3 mt-1"
              aria-invalid={!!errors.requirement}
              aria-describedby="requirement-error"
            />
            {errors.requirement && (
              <p id="requirement-error" className="text-red-600 text-sm mt-1">
                {errors.requirement}
              </p>
            )}
          </div>

          {/* Additional */}
          <div>
            <label htmlFor="additional" className="font-semibold text-gray-800">
              Additional Notes (optional)
            </label>
            <textarea
              id="additional"
              rows={3}
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md p-3 mt-1"
            />
          </div>

          {/* File */}
          <div>
            <label htmlFor="file" className="font-semibold text-gray-800">
              Upload Reference (optional)
            </label>
            <input
              id="file"
              type="file"
              disabled={submitting}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full border border-gray-300 p-2 rounded-md"
            />
            {errors.file && (
              <p className="text-red-600 text-sm mt-1">{errors.file}</p>
            )}

            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative flex items-center justify-center font-semibold text-sm sm:text-base
                       bg-black text-white shadow hover:bg-black/90 h-11 sm:h-12 px-6 w-full rounded-full
                       transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
          >
            <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>

            {submitting ? "Processing..." : "Submit & Pay"}
            <ArrowRight className="ml-3 h-5" />
          </button>

          {errors.submit && (
            <p className="text-center text-red-600 text-sm">{errors.submit}</p>
          )}
        </form>
      </div>
    </div>
  );
}