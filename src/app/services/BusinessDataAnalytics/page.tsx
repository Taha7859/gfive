"use client";

import Image from "next/image";
import {
  BarChart3,
  Database,
  PieChart,
  FileSpreadsheet,
  CheckCircle,
} from "lucide-react";

export default function BusinessDataAnalytics() {
  return (
    <main className="bg-white text-[#0f172a] leading-relaxed">
      {/* 🌟 Hero Section */}
      <header className="relative bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white text-center py-28 px-6 md:px-16 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Turn Your Business Data Into Smart Decisions
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
            We help you uncover insights hidden in your numbers - from sales
            and costs to customer behavior -so you can make confident,
            data-driven decisions.
          </p>
          <a
            href="mailto:shpfusion@gmail.com"
            className="bg-white text-[#0f172a] font-semibold px-8 py-3 rounded-full hover:bg-[#e2e8f0] transition"
          >
            Get Your Data Analyzed
          </a>
        </div>

        {/* Hero Background */}
        <Image
          src="/data.jpg"
          alt="Data analytics concept background"
          fill
          priority
          className="object-cover opacity-20 absolute inset-0"
        />
      </header>

      {/* 📊 Our Process Section */}
      <section
        id="process"
        className="py-24 px-6 md:px-16 bg-gradient-to-br from-[#f9fafb] via-[#e0f2fe] to-[#f1f5f9]"
      >
        <div className="max-w-7xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Our Process - How We Work With Your Data
          </h2>
          <p className="text-gray-700 max-w-3xl font-semibold mx-auto text-base md:text-lg">
            We follow a structured, transparent, and efficient workflow to
            ensure your business gets clear, actionable insights from your data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            {
              step: "1. Data Collection",
              desc: "Securely gather relevant business data (sales, costs, reports, etc.) for analysis.",
              icon: Database,
            },
            {
              step: "2. Cleaning & Structuring",
              desc: "Organize, format, and validate your raw data for accuracy and consistency.",
              icon: FileSpreadsheet,
            },
            {
              step: "3. Analysis & Visualization",
              desc: "Use Excel or Power BI to craft interactive dashboards and data visuals.",
              icon: PieChart,
            },
            {
              step: "4. Insights & Reporting",
              desc: "Deliver monthly reports with clear KPIs, performance insights, and recommendations.",
              icon: BarChart3,
            },
          ].map(({ step, desc, icon: Icon }) => (
            <article
              key={step}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition border border-gray-100"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-[#0e6bd6] text-white rounded-full mb-6 mx-auto">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step}</h3>
              <p className="text-gray-700 font-semibold text-sm">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 💼 Why Choose Us Section */}
      <section
        id="why-us"
        className="py-24 px-6 md:px-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
      >
        {/* Left Text */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Why Businesses rely on{" "}
            <span className="text-[#1e3a8a]">ShpFusion</span> for Analytics
          </h2>
          <ul className="space-y-4 text-base font-semibold text-gray-700">
            {[
              "Expertise in Excel, Power BI, and visualization tools.",
              "Tailored dashboards for Retail, Service, SaaS & E-Commerce.",
              "Secure, confidential, and time-efficient process.",
              "Reports delivered in easy-to-understand visuals.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-96">
          <Image
            src="/data.jpg"
            alt="Data visualization dashboard example"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <footer className="text-center py-24 px-6 md:px-16 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Transform Your Business Through Data
        </h2>
        <p className="max-w-2xl mx-auto text-lg font-semibold mb-8 opacity-90">
          Let our analytics experts turn your numbers into smart insights that
          drive measurable business growth.
        </p>
        <a
  href="mailto:shpfusion@gmail.com"
  className="bg-white text-[#0f172a] font-bold rounded-full hover:bg-[#e2e8f0] transition 
             px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 text-sm sm:text-base md:text-lg text-center w-full sm:w-auto"
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
      </footer>
    </main>
  );
}
