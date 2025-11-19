"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { X } from "lucide-react";
import FancyButton from "@/component/style/categorybutton";

type LogoItem = {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
};

export default function LogoPage() {
  const [items, setItems] = useState<LogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<LogoItem | null>(null);

  useEffect(() => {
    const fetchLogos = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="logoBranding" && category == "logoDesign"] | order(_createdAt asc){
          _id,
          title,
          "imageUrl": image.asset->url,
          category
        }`;
        const data: LogoItem[] = await client.fetch(query);
        setItems(data);
      } catch (err) {
        console.error("❌ Error fetching logos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Logo Design & Branding | YourCompany</title>
        <meta
          name="description"
          content="Explore premium logo design and branding services. High-quality logos and branding solutions for your business."
        />
        <meta
          name="keywords"
          content="logo design, branding, business logo, professional logos"
        />
      </Head>

      {/* 🔘 Sticky Top Navigation Buttons */}
      <div className="sticky top-20 z-20 flex justify-center gap-4 mt-20 pt-4 pb-4 bg-white/70 backdrop-blur-md">
        <FancyButton href="/services/logo-branding" label="Logos" active />
        <FancyButton href="/services/branding" label="Branding" />
      </div>

      {/* 🖼️ Logos Section */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">No logos found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedImage(item)}
                className="relative aspect-[16/10] overflow-hidden rounded-lg shadow hover:scale-105 transition cursor-pointer"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain rounded-lg"
                  unoptimized
                  priority
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔍 Image Popup without button */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white rounded-full p-2 transition"
            >
              <X size={26} />
            </button>
            <div className="w-full flex justify-center items-center">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                width={1000}
                height={700}
                className="w-full h-auto max-h-[80vh] object-contain rounded-t-2xl"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
