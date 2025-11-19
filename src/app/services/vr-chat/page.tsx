"use client";

import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import CategoriesNav from "@/component/CategoriesNav";
import { X } from "lucide-react";
import Link from "next/link";
import GraphicButem from "@/component/style/button";

type VRChatItem = {
  _id: string;
  title: string;
  imageUrl: string;
  price: number;
  label?: string;
};

export default function VRChatPage() {
  const [items, setItems] = useState<VRChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<VRChatItem | null>(null);

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

  // ✅ Fetch VR Chat animated items
  useEffect(() => {
    const fetchVRChat = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="streamgraphics" && lower(category)=="vr chat" && lower(subType)=="animated"] | order(_createdAt asc){
          _id,
          title,
          "imageUrl": image.asset->url,
          price
        }`;

        const data: VRChatItem[] = await client.fetch(query);

        // ✅ Dynamic labels: Premium / Standard / Basic
        const labeled = data.map((item, i) => ({
          ...item,
          label:
            i === 0
              ? `Premium ($${item.price ?? "--"})`
              : i === 1
              ? `Standard ($${item.price ?? "--"})`
              : `Basic ($${item.price ?? "--"})`,
        }));

        setItems(labeled);
      } catch (err) {
        console.error("❌ Error fetching VR Chat items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVRChat();
  }, []);

  // ✅ Chunk items for grid display
  const chunkedItems = useMemo(() => {
    const chunks: VRChatItem[][] = [];
    for (let i = 0; i < items.length; i += 3) chunks.push(items.slice(i, i + 3));
    return chunks;
  }, [items]);

  return (
    <>
      <Head>
        <title>VR Chat Animated Graphics | ShopFusion</title>
        <meta
          name="description"
          content="Explore high-quality VR Chat animated graphics — Premium, Standard, and Basic designs by ShopFusion."
        />
        <meta
          name="keywords"
          content="VR Chat graphics, animated VR Chat, stream graphics, ShopFusion"
        />
      </Head>

      <div className="min-h-screen bg-white text-gray-900 select-none">
        <CategoriesNav />

        <div className="p-6 pt-28">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No VR Chat items found</p>
          ) : (
            chunkedItems.map((group, groupIndex) => (
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
                      className="relative border rounded-lg overflow-hidden shadow group cursor-pointer bg-gray-50 hover:shadow-lg transition-all duration-300"
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
