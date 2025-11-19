// src/components/Footer.tsx
import Link from "next/link";

export default function Pooter() {
  return (
    <footer className="bg-[#0b0d17] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-white">ShopFusion</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Creative solutions for your business.  
            Professional design & development services to help your brand shine.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Get in Touch</h3>
          <p className="text-sm">Email: hello@shopfusion.com</p>
          <p className="text-sm mb-4">Phone: +1 (555) 123-4567</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" aria-label="Twitter" className="hover:text-white">🐦</a>
            <a href="#" aria-label="Facebook" className="hover:text-white">📘</a>
            <a href="#" aria-label="Instagram" className="hover:text-white">📸</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-6">
        <p className="text-center text-sm text-gray-400 py-4">
          © {new Date().getFullYear()} ShopFusion Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}



