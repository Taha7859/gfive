"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { useState } from "react";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
      services: formData.getAll("services"),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(result.error || "Failed to send message.");
    } else {
      setMessage("Message sent successfully!");
      const form = document.getElementById("contactForm") as HTMLFormElement;
if (form) form.reset();

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-10 sm:py-16 mt-16 sm:mt-20">
      {/* Header Section */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Any question or remark? Just write us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white py-8 sm:py-10 rounded-2xl px-5 sm:px-10 max-w-6xl mx-auto gap-6">

        {/* Left Column Unchanged */}
        <div className="relative bg-slate-900 text-white shadow-xl p-6 sm:p-8 rounded-2xl overflow-hidden">
          <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-sky-600 rounded-full opacity-80 translate-x-8 translate-y-8"></div>
          <div className="absolute bottom-6 sm:bottom-14 right-6 sm:right-12 w-12 h-12 sm:w-24 sm:h-24 bg-blue-500 rounded-full opacity-70"></div>

          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Contact Information</h2>
            <p className="text-gray-300 mb-6 sm:mb-8 max-w-xs sm:max-w-sm">
              Fill up the form and our Team will get back to you within 24 hours.
            </p>

            <ul className="space-y-5 lg:mt-10 lg:space-y-10 text-sm sm:text-base">
              <li className="flex items-center gap-3 sm:gap-4">
                <div className="bg-blue-900 p-2 sm:p-3 rounded-full">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-gray-200 break-all">ShpFusion@gmail.com</span>
              </li>

              <li className="flex items-center gap-3 sm:gap-4">
                <div className="bg-blue-900 p-2 sm:p-3 rounded-full">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-gray-200 break-all">+44 730 968 4324</span>
              </li>

              <li className="flex items-center gap-3 sm:gap-4">
                <div className="bg-blue-900 p-2 sm:p-3 rounded-full">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-gray-200">Address: Chadwell Heath, Essex</span>
              </li>
            </ul>

            <div className="flex items-center gap-5 mt-6 lg:mt-10 sm:mt-8">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM FIXED */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Get in touch</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First name" required className="w-full border border-gray-300 rounded-lg px-4 py-3" />
              <input type="text" name="lastName" placeholder="Last name" required className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>

            <input type="email" name="email" required placeholder="Your Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3" />

            <textarea name="message" rows={5} required placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none" />

            <label className="block font-medium">Services</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              {[
                "Stream Graphics",
                "Character Design",
                "Business Logo & Branding",
                "Web Development",
                "Ecommerce (V.A)",
                "Digital Marketing",
                "Business Data Analytics",
                "Book Keeping",
                "Others"
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input type="checkbox" name="services" value={item} />
                  {item}
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {message && <p className="text-center text-sm mt-4">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
