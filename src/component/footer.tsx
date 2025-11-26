"use client";

import Link from "next/link";
import Image from "next/image";
import { FaSquareUpwork } from "react-icons/fa6";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      await response.json(); // removed variable → no warning

      if (!response.ok) {
        setMsg("error");
      } else {
        setMsg("success");
        setEmail("");
      }
    } catch {
      // removed _error → no warning
      setMsg("error");
    }

    setLoading(false);
  };

  return (
    <footer className="bg-[#0f172a] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Logo */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/logo1.png"
                alt="ShpFusion Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <div>
                <p className="text-white text-2xl font-semibold w-60">
                  ShpFusion <span className="text-sky-400">Ltd.</span>
                </p>
                <p className="hover:text-white font-semibold">
                  {"Let's grow together !"}
                </p>
              </div>
            </Link>
          </div>

          {/* Company */}
          <div className="lg:ml-16">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link href="/services/digital-marketing" className="hover:text-white">Digital Marketing</Link></li>
              <li><Link href="/services/EcommerceVirtualAssistant" className="hover:text-white">E-Commerce (V.A)</Link></li>
              <li><Link href="/services/BusinessDataAnalytics" className="hover:text-white">Data Analytics</Link></li>
              <li><Link href="/services/book-keeping" className="hover:text-white">Bookkeeping</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-white">Terms of service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
              <li><Link href="/license" className="hover:text-white">License</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <p>Email: <Link href="mailto:ShpFusion@gmail.com" className="hover:text-white">ShpFusion@gmail.com</Link></p>
            <p>Phone: +44 730 968 4324</p>
            <p className="w-60">Address: Chadwell Heath, Essex</p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-white font-semibold">Subscribe to our newsletter</h4>
            <p className="text-sm text-gray-400">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
          </div>

          <div className="flex flex-col items-center w-full max-w-md">

            {msg === "success" && (
              <div className="w-full -mt-4 mb-4 rounded-md bg-green-600/20 text-green-400 border border-green-700 px-4 py-2 text-sm text-center">
                ✅ Thanks for subscribing
              </div>
            )}

            {msg === "error" && (
              <div className="w-full -mt-4 mb-4 rounded-md bg-red-600/20 text-red-400 border border-red-700 px-4 py-2 text-sm text-center">
                ❌ Please enter a valid email
              </div>
            )}

            <form onSubmit={handleSubscribe} className="flex w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-l-md bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-r-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>

          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">© 2024 ShpFusion, Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="https://www.facebook.com/ShpFusionSF" className="hover:text-white"><Facebook size={20} /></Link>
            <Link href="https://www.instagram.com/shpfusion/" className="hover:text-white"><Instagram size={20} /></Link>
            <Link href="#"><Twitter size={20} /></Link>
            <Link href="#"><FaSquareUpwork size={20} /></Link>
            <Link href="#"><Linkedin size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
