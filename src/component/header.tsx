"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  Shield,
} from "lucide-react";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/app/SessionProviderWrapper";

// Services data
const SERVICES = [
  { path: "graphics", label: "Stream Graphics" },
  { path: "character-design", label: "Character Design" },
  { path: "logo-branding", label: "Business Logo & Branding" },
  { path: "web-development", label: "Web Development" },
  { path: "digital-marketing", label: "Digital Marketing" },
  { path: "EcommerceVirtualAssistant", label: "E-Commerce (Virtual Assistant)" },
  { path: "BusinessDataAnalytics", label: "Business Data Analytics" },
  { path: "book-keeping", label: "Bookkeeping Services" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout, loading } = useAuth();

  // Refs for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // 🔹 Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Auto-close menus on route change
  useEffect(() => {
    setOpen(false);
    setMobileDropdown(false);
    setDropdown(false);
    setUserMenu(false);
  }, [pathname]);

  // 🔹 Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && open) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // 🔹 Enhanced logout handler
  const handleLogout = useCallback(async () => {
    try {
      setUserMenu(false);
      setOpen(false);
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, router]);

  // 🔹 Escape key to close menus
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setDropdown(false);
        setUserMenu(false);
        setMobileDropdown(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  // 🔹 Prevent body scroll when mobile menu is open - FIXED VERSION
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
    };
  }, [open]);

  if (loading) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#030a1d] to-[#030a1d]">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-[#0d1323] to-[#0d1323] backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-[#030a1d] to-[#030a1d]"
      } text-white`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 transition-transform active:scale-95"
        >
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

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* Home Link */}
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              pathname === "/" 
                ? "text-sky-400 bg-sky-400/10" 
                : "text-gray-300 hover:text-sky-400 hover:bg-white/5"
            }`}
          >
            <FaHome size={16} />
            <span>Home</span>
          </Link>

          {/* Services Dropdown */}
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname.startsWith("/services") 
                  ? "text-sky-400 bg-sky-400/10" 
                  : "text-gray-300 hover:text-sky-400 hover:bg-white/5"
              }`}
            >
              <Layers size={16} />
              <span>Services</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  dropdown ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            
            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 mt-2 w-64 bg-[#0d1323] border border-gray-700 rounded-lg shadow-xl transition-all duration-300 ${
                dropdown
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <div className="p-2">
                {SERVICES.map((service, index) => (
                  <Link
                    key={service.path}
                    href={`/services/${service.path}`}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === `/services/${service.path}`
                        ? "bg-sky-500/20 text-sky-400"
                        : "text-gray-300 hover:bg-sky-500/10 hover:text-sky-400"
                    } ${index !== SERVICES.length - 1 ? "mb-1" : ""}`}
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Other Navigation Links */}
          {[
            { href: "/about-us", icon: Users, label: "About Us" },
            { href: "/contact", icon: Phone, label: "Contact" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === href
                  ? "text-sky-400 bg-sky-400/10"
                  : "text-gray-300 hover:text-sky-400 hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}

          {/* Auth Section */}
          {/* Auth Section */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-700/50">
            {user ? (
              <div ref={userMenuRef} className="relative">
                {/* User Profile Button */}
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 transition-all duration-200 px-4 py-2.5 rounded-full shadow-lg hover:shadow-sky-500/25 active:scale-95"
                  aria-label="User menu"
                >
                  <FaUserCircle size={18} />
                  <span className="max-w-32 truncate font-medium">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      userMenu ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {userMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#0d1323] border border-gray-700/80 rounded-xl shadow-2xl backdrop-blur-lg py-3 animate-in fade-in-0 zoom-in-95">
                    {/* User Info */}
                    <div className="px-4 pb-3 mb-2 border-b border-gray-700/50">
                      <p className="font-semibold text-white truncate">
                        {user.name || "Welcome User"}
                      </p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      {user.role === "admin" && (
                        <div className="flex items-center gap-1 mt-1">
                          <Shield size={12} className="text-green-400" />
                          <span className="text-xs text-green-400 font-medium">Administrator</span>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors duration-200 border-t border-gray-700/50 mt-2 pt-2"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg border border-sky-500 text-sky-400 hover:bg-sky-500/10 font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-sky-500/25 hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all active:scale-95 z-[100]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - FIXED Z-INDEX ISSUE */}
      {open && (
        <>
          {/* Backdrop - HIGH Z-INDEX */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 z-[90]"
            onClick={() => setOpen(false)}
          />
          
          {/* Mobile Menu Panel - HIGHEST Z-INDEX */}
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85%] bg-[#0d1323] border-l border-gray-700 shadow-2xl z-[100] overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#0d1323] sticky top-0 z-10">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                  <Image
                    src="/logo/logo1.png"
                    alt="ShpFusion Logo"
                    width={36}
                    height={36}
                    className="rounded"
                  />
                  <span className="text-lg font-semibold">
                    ShpFusion <span className="text-sky-400">Ltd.</span>
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {/* Home */}
                <Link
                  href="/"
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                    pathname === "/" 
                      ? "text-sky-400 bg-sky-400/10" 
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>

                {/* Services Dropdown */}
                <div className="space-y-1">
                  <button
                    className={`flex items-center justify-between w-full p-3 rounded-lg font-medium transition-colors ${
                      pathname.startsWith("/services")
                        ? "text-sky-400 bg-sky-400/10"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                    onClick={() => setMobileDropdown(!mobileDropdown)}
                  >
                    <span className="flex items-center gap-3">
                      <Briefcase size={18} />
                      Services
                    </span>
                    <ChevronRight
                      size={18}
                      className={`transition-transform duration-300 ${
                        mobileDropdown ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {mobileDropdown && (
                    <div className="ml-4 space-y-1 animate-in fade-in-0">
                      {SERVICES.map((service) => (
                        <Link
                          key={service.path}
                          href={`/services/${service.path}`}
                          className={`block p-3 rounded-lg text-sm transition-colors ${
                            pathname === `/services/${service.path}`
                              ? "text-sky-400 bg-sky-400/10"
                              : "text-gray-400 hover:text-sky-400 hover:bg-white/5"
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          {service.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Other Links */}
                {[
                  { href: "/about-us", icon: Users, label: "About Us" },
                  { href: "/contact", icon: Phone, label: "Contact" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                      pathname === href
                        ? "text-sky-400 bg-sky-400/10"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Auth Section */}
              <div className="p-4 border-t border-gray-700 space-y-3 bg-[#0d1323] sticky bottom-0">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="p-3 bg-white/5 rounded-lg border border-gray-700">
                      <p className="font-semibold text-white truncate">
                        {user.name || "Welcome User"}
                      </p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-3 rounded-lg border border-sky-500 text-sky-400 hover:bg-sky-500/10 font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full text-center px-4 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
