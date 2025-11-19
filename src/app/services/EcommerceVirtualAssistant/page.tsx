"use client";

import Image from "next/image";
import { ClipboardList, BarChart, Headphones, ShoppingCart, Truck, Users } from "lucide-react";

export default function EcommerceVirtualAssistant() {
  return (
    <section className="bg-white text-[#0f172a]">
      {/* ✅ Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white py-24 px-6 md:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Professional E-Commerce Virtual Assistant Services
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
          Focus on growing your business while we handle the rest - from product listings and inventory updates
          to customer communication and order management.
        </p>
        <a
          href="mailto:shpfusion@gmail.com"
          className="bg-white text-[#0f172a] font-semibold px-8 py-3 rounded-full hover:bg-[#e2e8f0] transition"
        >
          Let’s Work Together
        </a>
        <Image
                  src="/eccom.jpg"
                  alt="Professional bookkeeping services"
                  fill
                  className="object-cover opacity-20"
                  priority
                />
      </div>

      {/* ✅ What We Offer */}
      <div className="py-24 px-6 md:px-20 md:grid md:grid-cols-2 md:gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">What We Offer</h2>
          <p className="text-gray-700 text-lg font-semibold leading-relaxed mb-6">
            Your All-in-One E-Commerce Support Team.
          </p>
          <p className="text-gray-700 text-lg font-semibold leading-relaxed">
            We provide reliable and experienced virtual assistants who manage your online store operations with
            precision and consistency. Our VAs take care of every detail to help your business run smoothly and scale faster.
          </p>
        </div>

        <div className="relative w-full h-96 md:h-[500px] mt-10 md:mt-0">
          <Image
            src="/eccom01.jpg"
            alt="E-Commerce Virtual Assistant"
            fill
            className="object-cover rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>

      {/* ✅ Core Services Section */}
      <div className="bg-gradient-to-br from-[#f9fafb] via-[#e0f2fe] to-[#f1f5f9] py-24 px-6 md:px-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Core Services Covered
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              icon: ClipboardList,
              title: "Product Listing & Optimization",
              desc: "Write compelling titles, bullet points, and SEO-friendly descriptions.",
            },
            {
              icon: Truck,
              title: "Inventory & Stock Updates",
              desc: "Keep product quantities and details accurate across all selling platforms.",
            },
            {
              icon: ShoppingCart,
              title: "Order Processing",
              desc: "Confirm, track, and manage customer orders efficiently.",
            },
            {
              icon: Headphones,
              title: "Customer Service",
              desc: "Respond to buyer queries and resolve issues quickly and professionally.",
            },
            {
              icon: BarChart,
              title: "Competitor & Price Research",
              desc: "Stay ahead with continuous price comparisons and market analysis.",
            },
            {
              icon: Users,
              title: "Data Entry & Reporting",
              desc: "Maintain accurate store data and generate detailed performance reports.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <Icon className="w-10 h-10 text-[#0e6bd6] mb-4" />
              <h3 className="text-xl font-extrabold mb-2">{title}</h3>
              <p className="text-gray-700 text-sm font-semibold leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Our Process Section */}
      <div className="py-24 px-6 md:px-20 md:grid md:grid-cols-2 md:gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-10">Our Process</h2>
          <div className="space-y-6">
            {[
              ["Consultation & Setup", "Understand your store’s structure, products, and goals."],
              ["Onboarding", "Assign a dedicated VA and define daily or weekly workflows."],
              ["Execution", "Manage listings, inventory, and customer communication seamlessly."],
              ["Reporting", "Provide weekly performance updates and improvement suggestions."],
            ].map(([step, desc], i) => (
              <div
                key={i}
                className="flex items-start gap-6 bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{step}</h3>
                  <p className="text-gray-700 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full h-96 md:h-[500px] mt-10 md:mt-0">
          <Image
            src="/eccom.jpg"
            alt="E-Commerce Process"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* ✅ CTA Section */}
      <div className="py-24 px-6 md:px-20 text-center bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Let’s Streamline Your Online Store
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          Save time, reduce workload, and grow faster with our expert E-Commerce Virtual Assistants.
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
