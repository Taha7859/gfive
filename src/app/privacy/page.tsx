"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🌊 Curved Gradient Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center shadow-md rounded-b-[80px] relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold mb-3"
        >
          🔐 Privacy Policy
        </motion.h1>
        <p className="text-gray-100 text-sm">Company:{" "}
          <span className="font-semibold">ShpFusion Ltd</span> |
          Effective Date: January 2024  
        </p>

        {/* Subtle curve visual effect */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-blue-900 to-blue-700 rounded-t-[100px]" />
      </section>

      {/* 📜 Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10 mt-[-50px] relative z-10"
      >
        <p className="text-sm text-gray-500 text-center mb-10">
          <strong>Company:</strong> ShpFusion Ltd <br />
          <strong>Effective Date:</strong> January 2024 <br />
          <strong>Contact:</strong>{" "}
          <a
            href="mailto:ShpFusion@gmail.com"
            className="text-blue-900 hover:underline"
          >
            ShpFusion@gmail.com
          </a>
        </p>

        <section className="space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              1. Introduction
            </h2>
            <p>
              At ShpFusion Ltd, your privacy is important to us. This Privacy
              Policy explains how we collect, use, and protect your personal
              information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              2. Data We Collect
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Personal details (name, email, contact information)</li>
              <li>Payment and transaction details</li>
              <li>Website usage data (via cookies or analytics tools)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              3. How We Use Your Data
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Process orders and deliver services</li>
              <li>Communicate project updates</li>
              <li>Improve user experience and service quality</li>
            
            <li >
              We never sell or rent personal data to third parties.
            </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              4. Data Security
            </h2>
            <li className="ml-6">
              We implement reasonable technical and organizational measures to
              safeguard your data from unauthorized access, loss, or misuse.
            </li>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              5. Cookies
            </h2>
            <li className="ml-6">
              Our website may use cookies to enhance usability and analyze
              performance. You can disable cookies in your browser settings if
              preferred.
            </li>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              6. Your Rights
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Access, correct, or request deletion of your personal data</li>
              <li>Withdraw consent for communications at any time</li>
            </ul>
          </div>

          <div className="">
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              7. Changes to Policy
            </h2>
            
            <li className="ml-6">
              We may update this Privacy Policy occasionally. Any changes will
              be posted on this page with the updated date.
            </li>
            
          </div>
        </section>

        <div className="text-center mt-12">
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/"
            className="inline-block px-8 py-3 text-white bg-blue-900 hover:bg-blue-950 rounded-full font-medium transition-all duration-300"
          >
            Back to Home
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
