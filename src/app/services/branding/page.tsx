"use client";

import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { X } from "lucide-react";
import FancyButton from "@/component/style/categorybutton";

type BrandingItem = {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
};

export default function BrandingPage() {
  const [items, setItems] = useState<BrandingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<BrandingItem | null>(null);

  // ✅ Disable right-click globally
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dblclick", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dblclick", prevent);
    };
  }, []);

  // ✅ Fetch Branding items dynamically
  useEffect(() => {
    const fetchBranding = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="logoBranding" && category=="brandIdentity"] | order(_createdAt asc){
          _id,
          title,
          "imageUrl": image.asset->url,
          category
        }`;
        const data: BrandingItem[] = await client.fetch(query);
        setItems(data);
      } catch (err) {
        console.error("❌ Error fetching branding items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranding();
  }, []);

  // ✅ Chunk items for faster rendering if needed
  const chunkedItems = useMemo(() => {
    const chunks: BrandingItem[][] = [];
    for (let i = 0; i < items.length; i += 6) {
      chunks.push(items.slice(i, i + 6));
    }
    return chunks;
  }, [items]);

  return (
    <>
      <Head>
        <title>Brand Identity & Branding Work | ShopFusion</title>
        <meta
          name="description"
          content="Explore professional branding work and brand identity designs by ShopFusion. High-quality logos and brand graphics dynamically fetched."
        />
        <meta
          name="keywords"
          content="branding, brand identity, professional logos, ShopFusion, branding graphics"
        />
      </Head>

      <div className="min-h-screen bg-white text-gray-900 select-none">

        {/* 🔘 Sticky Top Navigation with Blur */}
        <div className="sticky top-20 z-20 flex justify-center gap-4 mt-20 pt-4 pb-4 bg-white/70 backdrop-blur-md">
          <FancyButton href="/services/logo-branding" label="Logos" />
          <FancyButton href="/services/branding" label="Branding" active />
        </div>

        {/* 🖼️ Branding Section */}
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No branding work found</p>
          ) : (
            chunkedItems.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {group.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedImage(item)}
                      className="relative aspect-[16/10] overflow-hidden rounded-lg shadow hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-auto object-contain rounded-lg"
                        draggable={false}
                        unoptimized
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔍 Modal */}
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
                  draggable={false}
                  unoptimized
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
