"use client";

import { CheckCircle, Star, Shield, Wrench, HeartHandshake } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-[#f8fafc] text-gray-800">
      {/* 🧩 Section 1 - Hero About */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between gap-16 px-6 md:px-20 py-28 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-100 via-white to-transparent -z-10" />

        {/* Left Content */}
        <div className="md:w-1/2 space-y-6 animate-fadeIn">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-700 to-sky-900 bg-clip-text text-transparent">
            About <span className="text-sky-500">Us</span>
          </h2>
          <p className="leading-relaxed text-lg text-gray-600">
            <strong>ShpFusion Ltd</strong> is a UK-based creative and technology company
            helping businesses grow through impactful design and innovative web
            solutions.
          </p>
          <p className="leading-relaxed text-lg text-gray-600">
            From branding and logos to full-scale web development, we provide
            digital services that elevate your business presence and connect
            you with the right audience.
          </p>
          <p className="leading-relaxed text-lg text-gray-600">
            With over <strong>10 years of combined experience</strong>, our team blends
            creativity with strategy to deliver meaningful results. We don’t just
            create visuals - we craft digital experiences that help you grow.
          </p>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 w-full flex justify-center relative">
          <div className="absolute -top-6 -right-6 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl z-0"></div>
          <Image
            src="/about-us.webp"
            alt="About ShopFusion"
            width={800}
            height={500}
            className="rounded-3xl shadow-2xl object-cover w-full max-w-2xl relative z-10 hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      </section>

      {/* 🧩 Section 2 - Why Choose Us */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-between gap-16 px-6 md:px-20 py-28 bg-gradient-to-br from-white via-sky-50 to-blue-100">
        {/* Left Image */}
        <div className="md:w-1/2  flex justify-center relative">
          <div className="absolute -bottom-10 -left-6 w-64 h-64 bg-sky-400/30 rounded-full blur-3xl z-0"></div>
          <Image
            src="/about.jpg"
            alt="Why Choose Us"
            width={650}
            height={500}
            className="rounded-3xl shadow-2xl object-cover relative z-10 hover:scale-[1.03] transition-transform duration-500"
          />
        </div>

        {/* Right Content */}
        
<div className="md:w-1/2 space-y-10 animate-fadeIn">
  <h2 className="text-4xl font-extrabold bg-gradient-to-r from-sky-700 to-blue-900 bg-clip-text text-transparent">
    Why Choose Us?
  </h2>

  <ul className="space-y-5 text-lg leading-relaxed text-gray-700">
    <li className="flex items-start gap-3">
      <CheckCircle className="text-sky-600 w-6 h-6 mt-1" />
      <span>UK-registered company (trusted internationally)</span>
    </li>

    <li className="flex items-start gap-3">
      <Star className="text-sky-600 w-6 h-6 mt-1" />
      <span>Tailored solutions for startups & small businesses</span>
    </li>

    <li className="flex items-start gap-3">
      <Shield className="text-sky-600 w-6 h-6 mt-1" />
      <span>Transparent pricing & ongoing support</span>
    </li>

    <li className="flex items-start gap-3">
      <Wrench className="text-sky-600 w-6 h-6 mt-1" />
      <span>Expertise in Design, Web Development & Branding</span>
    </li>

    <li className="flex items-start gap-3">
      <HeartHandshake className="text-sky-600 w-6 h-6 mt-1" />
      <span>Commitment to quality & long-term partnerships</span>
    </li>
  </ul>
</div>
      </section>

      {/* 🧩 Section 3 - Vision */}
      <section className="py-24 bg-[#0d1323] text-center text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent mb-6">
            Our Vision
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
  At <strong>ShpFusion</strong>, we believe your growth is our success.&nbsp;Let&apos;s build something{" "}
  <span className="text-sky-400 font-semibold">remarkable</span> together -&nbsp;A future where creativity meets innovation.
</p>

        </div>
      </section>
    </div>
  );
}
