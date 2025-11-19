"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* 🔵 Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-24 text-center overflow-hidden">
        {/* Curved Bottom SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16 md:h-28"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1920 150"
            preserveAspectRatio="none"
          >
            <path
              fill="#fff"
              d="M0,50 C480,150 1440,-50 1920,50 L1920,150 L0,150 Z"
            />
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-4 tracking-wide"
        >
          📜 Legal Information
        </motion.h1>
        <p className="text-gray-200 text-sm">
           Company:{" "} <span className="font-semibold text-blue-300">ShpFusion Ltd</span> |  Effective Date: January 2024 
          
        </p>
      </section>

      {/* 📑 Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-5xl mx-auto p-8 md:p-12 bg-white shadow-xl rounded-2xl mt-[-60px] relative z-10"
      >
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          This Legal page outlines our company’s key legal information,
          including intellectual property rights, disclaimers, data usage, and
          other important legal terms applicable to{" "}
          <span className="font-semibold text-blue-800">ShpFusion Ltd</span> and
          its users.
        </p>

        <div className="space-y-10">
          <Section
            title="1. Legal Ownership"
            text="All digital assets, source code, logos, brand designs, and associated
            intellectual property belong to ShpFusion Ltd. Unauthorized use,
            reproduction, or resale of any asset is strictly prohibited without
            written consent."
          />

          <Section
            title="2. Disclaimer"
            text="The materials on our website are provided for general information
            purposes only. We make no warranties about accuracy, reliability, or
            completeness. Any reliance you place on such information is strictly
            at your own risk."
          />

          <Section
            title="3. Limitation of Liability"
            text="In no event shall ShpFusion Ltd be liable for any damages arising
            out of the use or inability to use the materials or services on our
            website, even if we have been notified of such possibilities."
          />

          <Section
            title="4. External Links"
            text="Our website may contain links to external sites that are not operated
            by us. We are not responsible for the content or practices of any
            third-party sites. Users are encouraged to review the privacy
            policies and terms of those websites."
          />

          <Section
            title="5. Intellectual Property Rights"
            text="All logos, brand identities, visual designs, and creative works are
            original creations of ShpFusion Ltd. Clients who purchase branding or
            design services receive limited usage rights upon full payment."
          />

          <Section
            title="6. Legal Jurisdiction"
            text="This website and its legal agreements are governed by the laws of
            England & Wales. Any disputes shall be subject to the exclusive
            jurisdiction of English courts."
          />

          <Section
            title="7. Contact for Legal Inquiries"
            text="For any legal concerns, compliance queries, or documentation
            requests, please reach out to our legal team:"
          />
          <p className="text-blue-800 flex font-bold ml-2">
            <Mail className="mr-2 text-blac"/> ShpFusion@gmail.com
          </p>
        </div>

        {/* 🔚 Footer */}
        <div className="text-center mt-16 border-t border-gray-200 pt-6">
          <p className="text-gray-500 text-sm mb-4">
            © 2024 ShpFusion Ltd. - Legal Information.
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
