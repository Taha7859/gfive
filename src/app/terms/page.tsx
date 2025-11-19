"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* 🧭 Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-24 text-center overflow-hidden">
        {/* Curved bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-20 md:h-32"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1920 250"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,180 C480,280 1440,80 1920,180 L1920,250 L0,250 Z"
            />
          </svg>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
         {/* ✅ Icon instead of emoji */}
          <h1 className="text-5xl font-bold tracking-wide mt-10">Terms of Service</h1>
          <p className="text-gray-200 text-sm"> Company:{' '}
            <span className="font-semibold text-blue-300">ShpFusion Ltd</span> |
            Effective Date: January 2024 
          </p>
        </motion.div>
      </section>

      {/* 📜 Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-5xl mx-auto p-8 md:p-12 bg-white shadow-xl rounded-2xl mt-[-80px] relative z-10"
      >
        {/* Intro */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to <span className="font-semibold text-blue-900">ShpFusion Ltd</span>. By
            accessing or using our website and services, you agree to these Terms of Service.
            Please read them carefully before using our platform.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10">
          <Section
            title="1. Services"
            text="ShpFusion Ltd provides a variety of creative, digital, and web-based services, including logo design, branding, web & app development, stream graphics, and analytics. We may update or discontinue services at our discretion."
          />

          <Section
            title="2. Payments & Refunds"
            text="All payments must be made at the time of purchase or project initiation. Refunds, if applicable, will be evaluated on a case-by-case basis. We encourage clients to review all deliverables during the process."
          />

          <Section
            title="3. Intellectual Property"
            text="All materials, graphics, and content produced by ShpFusion Ltd remain our property until full payment is received. After payment, specific ownership rights are granted as per contract. Unauthorized reproduction is prohibited."
          />

          <Section
            title="4. User Conduct"
            text="Users must not misuse our website, attempt to hack, or upload malicious content. Any violation of these terms may lead to account suspension or permanent ban from our platform."
          />

          <Section
            title="5. Limitation of Liability"
            text="We are not liable for indirect or incidental damages arising from service use. Our liability is limited to the amount paid for the service related to the claim."
          />

          <Section
            title="6. Termination"
            text="We reserve the right to suspend or terminate your access if you breach these terms or misuse our services. Termination does not waive your obligation to pay for work already completed."
          />

          <Section
            title="7. Governing Law"
            text="These Terms are governed by the laws of England & Wales. Any disputes will be handled under the jurisdiction of English courts."
          />

          <Section
            title="8. Contact Us"
            text="If you have any questions about these Terms, please contact us at:"
          />
          <p className="text-blue-800 flex font-bold ml-2">
            <Mail className="mr-2 text-blac"/> ShpFusion@gmail.com
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 border-t border-gray-200 pt-6">
          <p className="text-gray-500 text-sm mb-4">
            © 2024 ShpFusion Ltd. - All Rights Reserved.
          </p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full bg-blue-900 hover:bg-blue-950 text-white font-semibold shadow-lg transition-all"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-3">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
