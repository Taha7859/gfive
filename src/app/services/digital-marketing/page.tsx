"use client";

import Image from "next/image";
import {
  BarChart,
  Target,
  Users,
  PenTool,
  Search,
  Send,
  CheckCircle,
} from "lucide-react";

export default function DigitalMarketing() {
  return (
    <section className="bg-white text-[#0f172a]">
      {/* ✅ Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white py-28 px-8 md:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Grow Your Brand with Targeted Digital Marketing
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
          We help your business reach the right audience with impactful
          strategies, creative visuals, and measurable results.
        </p>
        <a
          href="mailto:shpfusion@gmail.com"
          className="bg-white text-[#0f172a] font-semibold px-8 py-3 rounded-full hover:bg-[#e2e8f0] transition"
        >
          Let’s Work Together
        </a>
        <Image
                          src="/futuristic meeting room.webp"
                          alt="Professional bookkeeping services"
                          fill
                          className="object-cover opacity-20"
                          priority
                        />
      </div>

      {/* ✅ What We Do Section */}
      <div className="py-28 px-8 md:px-20 md:grid md:grid-cols-2 gap-y-12 md:gap-x-16 items-center">
        {/* Left - Text */}
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">What We Do</h2>
          <p className="text-gray-700 font-semibold text-lg leading-relaxed">
            At <span className="font-bold text-blue-800">ShpFusion Ltd</span>, we combine creativity, strategy,
            and analytics to give your brand the online presence it deserves.
            Whether you’re a startup or an established business, our digital
            marketing team ensures your campaigns attract attention, drive
            engagement, and convert leads into loyal customers.
          </p>
        </div>

        {/* Right - Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-[28rem] lg:h-[32rem] mt-12 md:mt-0">
          <Image
            src="/digital-marketing.jpg"
            alt="Digital Marketing Team"
            fill
            className="object-cover rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>

      {/* ✅ Core Services Section */}
      <div className="bg-gradient-to-br from-[#f9fafb] via-[#e0f2fe] to-[#f1f5f9] py-28 px-8 md:px-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Core Services Covered
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              icon: Users,
              title: "Social Media Management",
              desc: "Facebook, Instagram, TikTok & LinkedIn marketing.",
            },
            {
              icon: Target,
              title: "Ad Campaigns",
              desc: "Meta & Google Ads with targeted paid promotions to maximize ROI.",
            },
            {
              icon: PenTool,
              title: "Content Creation & Branding",
              desc: "Eye-catching visuals and engaging copy for your audience.",
            },
            {
              icon: Search,
              title: "SEO Optimization",
              desc: "Make your website rank higher and attract organic traffic.",
            },
            {
              icon: Send,
              title: "Email Marketing",
              desc: "Stay connected through personalized and automated emails.",
            },
            {
              icon: BarChart,
              title: "Analytics & Reporting",
              desc: "Get transparent reports and actionable insights.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <Icon className="w-10 h-10 text-[#0e6bd6] mb-4" />
              <h3 className="text-2xl font-extrabold mb-2">{title}</h3>
              <p className="text-gray-700 font-semibold leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Our Process Section */}
      <div className="py-28 px-8 md:px-20 md:grid md:grid-cols-2 gap-y-12 md:gap-x-16 items-center">
        {/* Left - Text */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-10">Our Process</h2>
          <div className="space-y-6">
            {[
              ["Consultation & Research", "We analyze your goals and target audience."],
              ["Strategy Development", "A custom digital plan is created with KPIs."],
              ["Creative Execution", "Our team designs, writes, and launches campaigns."],
              ["Optimization", "We track performance and fine-tune for better results."],
              ["Reporting", "You receive transparent monthly reports and insights."],
            ].map(([step, desc], i) => (
              <div
                key={i}
                className="flex items-start gap-6 bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{step}</h3>
                  <p className="text-gray-700 font-semibold text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-[28rem] lg:h-[32rem] mt-12 md:mt-0">
          <Image
            src="/our-process.jpg"
            alt="Our Marketing Process"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* ✅ Why Choose Us Section */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white py-28 px-8 md:px-20 md:grid md:grid-cols-2 gap-y-12 md:gap-x-16 items-center">
        {/* Left - Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-[28rem] lg:h-[32rem] mb-12 md:mb-0">
          <Image
            src="/kl.jpg"
            alt="Why Choose Us"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Right - Text */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Why Choose Us</h2>
          <ul className="space-y-4 text-lg">
            {[
              "10+ years of combined creative & analytical experience",
              "Full in-house design and marketing integration",
              "Data-driven decision making",
              "Quick communication/response via email",
              "Affordable, flexible packages",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 mt-1" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ✅ Contact CTA */}
      <div className="py-28 px-8 md:px-20 text-center bg-gradient-to-r ">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Take Your Brand Digital?
        </h2>
        <p className="max-w-2xl mx-auto font-semibold text-lg mb-8">
          Let’s grow together and take your online presence to the next level.
        </p>
        <a
  href="mailto:shpfusion@gmail.com"
  className=" text-center w-full sm:w-auto 
             bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] 
             text-white font-bold rounded-full 
             px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 
             text-sm sm:text-base md:text-lg 
             hover:from-[#1e3a8a] hover:to-[#0f172a] transition"
>
  Email Us: shpfusion@gmail.com
</a>
<div className="mt-8">
  <a
  href="/contact"
  className=" text-center w-full sm:w-auto 
             bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] 
             text-white font-bold rounded-full 
             px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 
             text-sm sm:text-base md:text-lg 
             hover:from-[#1e3a8a] hover:to-[#0f172a] transition"
>
  Contact Us
</a>
</div>


      </div>
    </section>
  );
}
