"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import GraphicButem from "@/component/style/button";
import CharacterCategoriesNav from "@/component/CharacterCategoriesNav";

type CharacterItem = {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  price: number;
  label?: string;
};

export default function FantasyPage() {
  const [items, setItems] = useState<CharacterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<CharacterItem | null>(null);

  // Disable right-click & double-click
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    const disableDoubleClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("dblclick", disableDoubleClick);
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("dblclick", disableDoubleClick);
    };
  }, []);

  // Fetch Fantasy characters dynamically
  useEffect(() => {
    const fetchFantasy = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="characterDesign" && lower(category) == "fantasycharacters"]
          | order(_createdAt asc){
            _id,
            title,
            "imageUrl": image.asset->url,
            category,
            price
          }`;
        const data: CharacterItem[] = await client.fetch(query);

        // Optional label for each group
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
        console.error("Error fetching Fantasy characters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFantasy();
  }, []);

  // Split items into chunks of 3 for grid
  const chunkArray = (arr: CharacterItem[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <>
      <Head>
        <title>Fantasy Characters | shpfusion.com</title>
        <meta
          name="description"
          content="Explore stunning Fantasy Characters — Premium, Standard, and Basic designs by shpfusion.com. Fully dynamic, fast loading, and SEO optimized."
        />
        <meta
          name="keywords"
          content="Fantasy Characters, shpfusion.com, Premium Fantasy, Standard Fantasy, Basic Fantasy, character designs"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="shpfusion.com" />
      </Head>

      <div className="min-h-screen bg-white select-none text-gray-900">
        <div className="sticky top-20 z-40 backdrop-blur-md bg-white/30">
          <CharacterCategoriesNav />
        </div>

        <div className="p-6 pt-28">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No Fantasy characters found</p>
          ) : (
            chunkArray(items, 3).map((group, groupIndex) => (
              <div key={groupIndex} className="mb-10">
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
                      className="relative aspect-[16/10] overflow-hidden rounded-lg shadow hover:scale-105 transition cursor-pointer group bg-gray-50"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-auto object-contain rounded-lg pointer-events-none transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        unoptimized
                        draggable={false}
                      />

                      {item.price && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-black/70 text-white text-lg font-bold px-4 py-2 rounded-full">
                            ${item.price}
                          </span>
                        </div>
                      )}
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
                  loading="lazy"
                  unoptimized
                  draggable={false}
                />
              </div>

              <div className="text-center py-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-2">{selectedImage.title}</h2>
                <p className="text-gray-600 mb-4">${selectedImage.price}</p>
                <Link
                  href={`/recuirment?productId=${selectedImage._id}`}
                  className="flex justify-center"
                >
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
