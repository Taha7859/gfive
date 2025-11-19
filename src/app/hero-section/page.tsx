
"use client"
import GradientButton from "@/component/style/getStartButton";
import Image from "next/image"

export default function Hero() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center pb-16">
      {/* Hero Section */}
      <section className="relative w-full px-6 py-16 sm:py-20 bg-slate-900 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 mt-20 lg:mt-0 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
              Creative Solutions
              <br />
              <span className="text-white">for Your Business</span>
            </h1>
            <p className="text-gray-300 font-semibold text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
              We provide professional design and development services to help your brand stand out.
            </p>
           <GradientButton
  label="Let's get started"
  onClick={() => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  }}
/>


          </div>

          {/* Logo/Graphic */}
          <div className="relative flex flex-col items-center lg:items-end mt-10 lg:mt-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Logo */}
                <div className="w-56 h-56 sm:w-72 sm:h-72 relative">
                  <Image
                    src="/logo/logo 2.png"
                    alt="Site Logo"
                    fill
                    className="object-contain rounded-3xl"
                    priority
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-8 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="absolute bottom-8 left-4 w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 left-2 w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-ping"></div>
            </div>

            {/* Gradient Text (Digital Partner line) */}
            <p className="relative bottom-6 mr- text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Make us your Digital Partner
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
