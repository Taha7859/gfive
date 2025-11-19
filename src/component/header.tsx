"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  Users,
  Phone,
  Layers,
  User,
  LogOut,
} from "lucide-react";
import { FaHome } from "react-icons/fa";
import { useAuth } from "@/app/SessionProviderWrapper";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();

  const { user, logout, loading } = useAuth();

  // 🔹 Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Auto-close menus on route change
  useEffect(() => {
    setOpen(false);
    setMobileDropdown(false);
    setDropdown(false);
    setUserMenu(false);
  }, [pathname]);

  if (loading) return null; // prevents flicker

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-[#0d1323]/80 to-[#0d1323]/80 backdrop-blur-md shadow-md"
          : "bg-gradient-to-r from-[#030a1d] to-[#030a1d]"
      } text-white`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo/logo1.png"
            alt="ShpFusion Logo"
            width={40}
            height={40}
            className="rounded"
            priority
          />
          <span className="text-xl font-semibold">
            ShpFusion <span className="text-sky-400">Ltd.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 relative z-50">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-sky-400 font-semibold"
          >
            <FaHome size={18} /> Home
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <button className="flex items-center space-x-1 hover:text-sky-400 font-semibold">
              <Layers size={18} /> <span>Services</span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  dropdown ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`absolute left-0 mt-3 w-52 bg-[#0d1323] border border-gray-700 rounded-lg shadow-lg transition-all duration-300 transform ${
                dropdown
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-3 invisible"
              }`}
            >
              {[
                ["graphics", "Stream Graphics"],
                ["character-design", "Character Design"],
                ["logo-branding", "Business Logo & Branding"],
                ["web-development", "Web Development"],
                ["digital-marketing", "Digital Marketing"],
                ["EcommerceVirtualAssistant", "E-Commerce (Virtual Assistant)"],
                ["BusinessDataAnalytics", "Business Data Analytics"],
                ["book-keeping", "Book Keeping Services"],
              ].map(([path, label]) => (
                <Link
                  key={path}
                  href={`/services/${path}`}
                  className="block px-4 py-2 hover:bg-sky-600/30"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/about-us"
            className="flex items-center gap-2 hover:text-sky-400 font-semibold"
          >
            <Users size={18} /> About Us
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 hover:text-sky-400 font-semibold"
          >
            <Phone size={18} /> Contact
          </Link>

          {/* 🔹 Auth Section */}
          {/* 🔹 Auth Section */}
{!loading && (user ? (
  <div className="relative">
    {/* Profile Icon */}
    <button
      onClick={() => setUserMenu(!userMenu)}
      className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 transition px-3 py-2 rounded-full"
    >
      <User size={20} />
    </button>

    {/* Dropdown */}
    {userMenu && (
      <div className="absolute right-0 mt-3 w-56 bg-[#0d1323] border border-gray-700 rounded-lg shadow-lg py-3">
        <div className="px-4 pb-2 border-b border-gray-700 mb-2">
          <p className="font-semibold">{user.name || "User"}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            setUserMenu(false);
          }}
          className="flex w-full items-center gap-2 px-4 py-2 hover:bg-sky-600/30 text-left"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    )}
  </div>
) : (
  <div className="flex items-center gap-4">
    {/* ✅ Only show links if user is NOT logged in */}
    <Link
      href="/login"
      className={`px-4 py-2 rounded-lg border border-sky-500 hover:bg-sky-600 transition ${
        user ? "hidden" : ""
      }`}
    >
      Login
    </Link>
    <Link
      href="/signup"
      className={`px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 transition ${
        user ? "hidden" : ""
      }`}
    >
      Sign Up
    </Link>
  </div>
))}

        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0d1323]/95 px-6 pb-4 space-y-3 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2 hover:text-sky-400">
            <Home size={18} /> Home
          </Link>

          <div>
            <button
              className="flex items-center justify-between w-full font-semibold hover:text-sky-400"
              onClick={() => setMobileDropdown(!mobileDropdown)}
            >
              <span className="flex items-center gap-2">
                <Briefcase size={18} /> Services
              </span>
              <ChevronRight
                size={18}
                className={`transition-transform duration-300 ${
                  mobileDropdown ? "rotate-90" : ""
                }`}
              />
            </button>

            {mobileDropdown && (
              <div className="pl-4 mt-2 space-y-2 text-gray-300">
                {[
                  ["graphics", "Stream Graphics"],
                  ["character-design", "Character Design"],
                  ["logo-branding", "Business Logo & Branding"],
                  ["web-development", "Web Development"],
                  ["digital-marketing", "Digital Marketing"],
                ].map(([path, label]) => (
                  <Link
                    key={path}
                    href={`/services/${path}`}
                    className="block hover:text-sky-400"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about-us"
            className="flex items-center gap-2 hover:text-sky-400"
          >
            <Users size={18} /> About Us
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 hover:text-sky-400"
          >
            <Phone size={18} /> Contact
          </Link>

          {/* Mobile Auth */}
          {user ? (
            <div className="mt-3 space-y-2">
              <div className="p-3 border border-gray-700 rounded-lg">
                <p className="font-semibold">{user.name || "User"}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="block w-full text-center px-4 py-2 rounded-lg border border-sky-500 hover:bg-sky-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-lg border border-sky-500 hover:bg-sky-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
