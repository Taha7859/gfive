"use client";

import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import CategoriesNav from "@/component/CategoriesNav";
import { X } from "lucide-react";
import Link from "next/link";
import GraphicButem from "@/component/style/button";

type GraphicItem = {
  _id: string;
  title: string;
  imageUrl: string;
  subType: string;
  price: number;
  label?: string;
};

export default function BannerPage() {
  const [items, setItems] = useState<GraphicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GraphicItem | null>(null);

  // Disable right-click & double-click
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dblclick", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dblclick", prevent);
    };
  }, []);

  // Fetch banners from Sanity
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="streamgraphics" && lower(category)=="banners" && lower(subType)=="static"]
          | order(_createdAt asc){
            _id,
            title,
            "imageUrl": image.asset->url,
            subType,
            price
          }`;

        const data: GraphicItem[] = await client.fetch(query);

        // Assign dynamic labels
        const labeledData = data.map((item, index) => {
  let label = "";
  
  if (index < 3) {
    // First 3 items: Premium
    label = `Premium ($${item.price})`;
  } else if (index < 6) {
    // Next 3 items: Standard
    label = `Standard ($${item.price})`;
  } else {
    // Remaining items: Basic
    label = `Basic ($${item.price})`;
  }
  
  return { ...item, label };
});

        setItems(labeledData);
      } catch (err) {
        console.error("❌ Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Chunk items into groups of 3
  const chunkedItems = useMemo(() => {
    const chunks: GraphicItem[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      chunks.push(items.slice(i, i + 3));
    }
    return chunks;
  }, [items]);

  return (
    <>
      <Head>
        <title>Static Banners | Moon Designs</title>
        <meta
          name="description"
          content="Explore high-quality static banners — Premium, Standard, and Basic designs by Moon Designs."
        />
        <meta
          name="keywords"
          content="static banners, stream graphics, Moon Designs, Twitch banners"
        />
      </Head>

      <div className="min-h-screen bg-white text-gray-900 select-none">
        <div className="sticky top-20 z-40 backdrop-blur-md bg-white/30">
          <CategoriesNav />
        </div>

        <div className="p-6 pt-28">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No static banners found</p>
          ) : (
            chunkedItems.map((group, index) => (
              <div key={index} className="mb-10">
                {group[0]?.label && (
                  <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                    {group[0].label}
                  </h2>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {group.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedImage(item)}
                      className="relative border rounded-lg overflow-hidden shadow hover:scale-105 transition cursor-pointer group bg-gray-50"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-48 sm:h-56 lg:h-64 xl:h-80 object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                        draggable={false}
                        unoptimized
                        priority
                      />

                      <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-black/70 text-white text-lg font-bold px-4 py-2 rounded-full">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
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
                  className="w-full h-auto max-h-[80vh] object-contain rounded-t-2xl pointer-events-none"
                  draggable={false}
                  unoptimized
                />
              </div>

              <div className="text-center py-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-2">{selectedImage.title}</h2>
                <p className="text-gray-600 mb-4">${selectedImage.price}</p>
                <Link href={`/recuirment?productId=${selectedImage._id}`} className="flex justify-center">
                  <GraphicButem />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
