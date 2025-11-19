"use client";

import Image from "next/image";
import { FileText, BarChart3, DollarSign, ClipboardCheck, CheckCircle } from "lucide-react";

export default function BookkeepingPage() {
  const services = [
    {
      title: "Daily Bookkeeping",
      desc: "Record sales, purchases, and expenses accurately and on time.",
      icon: FileText,
    },
    {
      title: "Bank & Cash Reconciliation",
      desc: "Match payments, deposits, and statements for complete accuracy.",
      icon: DollarSign,
    },
    {
      title: "Profit & Loss Statements",
      desc: "Get monthly insights into your income and spending trends.",
      icon: BarChart3,
    },
    {
      title: "Balance Sheet Preparation",
      desc: "Know your assets, liabilities, and company’s true financial position.",
      icon: ClipboardCheck,
    },
    {
      title: "Accounts Receivable & Payable",
      desc: "Track customer dues and manage vendor payments efficiently.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="bg-white text-[#0f172a]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white py-28 px-6 md:px-16 text-center overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Accurate Bookkeeping That Keeps Your Business on Track
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-10">
            We handle your daily accounting, financial reports, and reconciliations - so you can
            focus on growing your business while we keep your books clean and compliant.
          </p>
          <a
            href="mailto:shpfusion@gmail.com"
            className="bg-white text-[#0f172a] font-semibold px-8 py-3 rounded-full hover:bg-[#e2e8f0] transition"
          >
            Get Expert Bookkeeping
          </a>
        </div>
        <Image
          src="/book01.jpg"
          alt="Professional bookkeeping services"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* What We Offer */}
      <div className="py-24 px-6 md:px-16 bg-gradient-to-br from-[#f9fafb] via-[#e0f2fe] to-[#f1f5f9]">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
          What We Offer - Your Reliable Financial Partner
        </h2>
        <p className="max-w-3xl mx-auto text-center text-gray-700 font-semibold text-lg mb-16">
          At <span className="font-semibold text-[#1e3a8a]">ShpFusion Ltd</span>, we simplify your
          financial management. Our expert bookkeepers ensure accurate entries, clear reports, and
          audit-ready accounts every month.
        </p>

        {/* Grid */}
        <div className="flex flex-col items-center gap-12">
          {/* Top Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
            {services.slice(0, 3).map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-[#0e6bd6] text-white rounded-full mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-700 text-sm font-semibold leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Row (2 cards centered) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 justify-center">
            {services.slice(3).map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-[#0e6bd6] text-white rounded-full mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-700 text-sm font-semibold leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Process */}
      <div className="py-24 px-6 md:px-16">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Our Process - How We Manage Your Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              step: "1. Onboarding & Setup",
              desc: "Review your current system and set up organized ledgers.",
            },
            {
              step: "2. Data Entry & Categorization",
              desc: "Record transactions and allocate them to correct accounts.",
            },
            {
              step: "3. Reconciliation & Verification",
              desc: "Ensure all balances, bank entries, and reports are accurate.",
            },
            {
              step: "4. Reporting & Delivery",
              desc: "Provide monthly financial reports with insights and suggestions.",
            },
          ].map(({ step, desc }) => (
            <div
              key={step}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-extrabold mb-3">{step}</h3>
              <p className="text-gray-700 text-sm font-semibold leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-24 px-6 md:px-16 md:grid md:grid-cols-2 md:gap-16 items-center bg-[#f9fafb]">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Why Businesses Trust{" "}
            <span className="text-[#1e3a8a]">ShpFusion</span> for Bookkeeping
          </h2>
          <ul className="space-y-4 text-lg font-semibold text-gray-700">
            {[
              "Qualified and experienced accountants",
              "Transparent reporting and strict data confidentiality",
              "Quick turnaround on monthly financial reports",
              "Works seamlessly with Excel and modern tools",
              "Scalable solutions for startups and growing businesses",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative w-full h-96 mt-10 md:mt-0">
          <Image
            src="/book01.jpg"
            alt="Bookkeeping dashboard"
            fill
            className="object-cover rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-24 px-6 md:px-16 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Let Us Handle Your Books, You Handle the Growth
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-8 opacity-90">
          Accurate. Timely. Reliable. That’s the{" "}
          <span className="font-semibold">ShpFusion</span> way of bookkeeping.
        </p>
        <a
  href="mailto:shpfusion@gmail.com"
  className="bg-white text-[#0f172a] font-bold rounded-full hover:bg-[#e2e8f0] transition 
             px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 text-sm sm:text-base md:text-lg  text-center w-full sm:w-auto"
>
  Email Us: shpfusion@gmail.com
</a>
<div className="mt-8">
  <a
  href="/contact"
  className="bg-white text-[#0f172a] font-bold rounded-full hover:bg-[#e2e8f0] transition 
             px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 text-sm sm:text-base md:text-lg  text-center w-full sm:w-auto"
>
  Contact Us
</a>
</div>

      </div>
    </section>
  );
}
