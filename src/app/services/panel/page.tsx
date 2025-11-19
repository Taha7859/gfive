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

export default function PanelPage() {
  const [items, setItems] = useState<GraphicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GraphicItem | null>(null);

  // Disable right-click & double click
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dblclick", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dblclick", prevent);
    };
  }, []);

  // Fetch Panels from Sanity
  useEffect(() => {
    const fetchPanels = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="streamgraphics" &&
          lower(category) == "panel" &&
          lower(subType) == "static"
        ] | order(_createdAt asc){
          _id,
          title,
          "imageUrl": image.asset->url,
          subType,
          price
        }`;

        const data: GraphicItem[] = await client.fetch(query);

        // Assign Premium / Standard / Basic dynamically
        const labeled = data.map((item, index) => ({
          ...item,
          label:
            index === 0
              ? `Premium ($${item.price})`
              : index === 1
              ? `Standard ($${item.price})`
              : `Basic ($${item.price})`,
        }));

        setItems(labeled);
      } catch (err) {
        console.error("❌ Panel Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanels();
  }, []);

  // Chunk items
  const chunkedItems = useMemo(() => {
    const chunks: GraphicItem[][] = [];
    for (let i = 0; i < items.length; i += 3) chunks.push(items.slice(i, i + 3));
    return chunks;
  }, [items]);

  return (
    <>
      <Head>
        <title>Static Panels | Moon Designs</title>
        <meta
          name="description"
          content="Explore premium-quality static panels for streams — Professional, clean and customizable panels."
        />
      </Head>

      <div className="min-h-screen bg-white text-gray-900 select-none">
        <div className="sticky top-20 z-40 bg-white/50 backdrop-blur-md">
          <CategoriesNav />
        </div>

        <div className="p-6 pt-28">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No panels found</p>
          ) : (
            chunkedItems.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-10">
                {group[0]?.label && (
                  <h2 className="text-xl font-semibold text-center mb-4">
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
                        unoptimized
                        priority
                        draggable={false}
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
                  className="w-full max-h-[80vh] object-contain rounded-t-2xl pointer-events-none"
                  unoptimized
                />
              </div>

              <div className="text-center py-6 bg-gray-50">
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
