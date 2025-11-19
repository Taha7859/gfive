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
  price: string;
};

export default function DarkFantasyPage() {
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

  // Fetch Dark Fantasy Characters with dynamic price
  useEffect(() => {
    const fetchDarkFantasy = async () => {
      setLoading(true);
      const query = `*[_type=="characterDesign" && lower(category) == "darkfantasycharacter"]
        | order(_createdAt asc){
          _id,
          title,
          "imageUrl": image.asset->url,
          category,
          price
        }`;
      const data: CharacterItem[] = await client.fetch(query);
      setItems(data);
      setLoading(false);
    };
    fetchDarkFantasy();
  }, []);

  // Split items into groups of 3
  const chunkArray = (arr: CharacterItem[], size: number) => {
    const chunks: CharacterItem[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <>
      <Head>
        <title>Dark Fantasy | shpfusion.com</title>
        <meta
          name="description"
          content="Explore stunning Dark Fantasy Characters — Premium, Standard, and Basic designs by shpfusion.com. Fully dynamic, fast loading, and SEO optimized."
        />
        <meta
          name="keywords"
          content="Dark Fantasy, shpfusion.com, Premium Dark Fantasy, Standard Dark Fantasy, Basic Dark Fantasy, character designs"
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
            <p className="text-center text-gray-500">No Dark Fantasy Characters found</p>
          ) : (
            chunkArray(items, 3).map((group, index) => (
              <div key={index} className="mb-10">
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
                        unoptimized
                        priority
                        draggable={false}
                      />

                      {item.price && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-black/70 text-white text-lg font-bold px-4 py-2 rounded-full">
                            {item.price}
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
                  unoptimized
                  draggable={false}
                />
              </div>

              <div className="text-center py-6 bg-gray-50">
                <Link href="/recuirment" className="flex justify-center">
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
