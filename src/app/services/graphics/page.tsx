"use client";

import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import CategoriesNav from "@/component/CategoriesNav";
import { X } from "lucide-react";
import Link from "next/link";
import GraphicButem from "@/component/style/button";
import HoverButton from "@/component/style/hoverButton";

type GraphicItem = {
  _id: string;
  title: string;
  imageUrl: string;
  subType: string;
  price: number;
  label?: string;
};

export default function LogoPage() {
  const [activeSub, setActiveSub] = useState<"static" | "animated">("static");
  const [items, setItems] = useState<GraphicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GraphicItem | null>(null);

  // Disable right-click & double-click globally
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dblclick", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dblclick", prevent);
    };
  }, []);

  // Fetch logos from Sanity
  useEffect(() => {
    const fetchLogos = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="streamgraphics" && lower(category)=="logo" && lower(subType)==$sub] | order(_createdAt asc){
          _id,
          title,
          "imageUrl": image.asset->url,
          subType,
          price
        }`;

        const data: GraphicItem[] = await client.fetch(query, { sub: activeSub });

        // Assign dynamic labels based on index
        const labeledData = data.map((item, index) => ({
          ...item,
          label:
            index === 0
              ? `Premium ($${item.price})`
              : index === 1
              ? `Standard ($${item.price})`
              : `Basic ($${item.price})`,
        }));

        setItems(labeledData);
      } catch (err) {
        console.error("❌ Error fetching logos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, [activeSub]);

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
        <title>{activeSub === "static" ? "Static Logos" : "Animated Logos"} | Moon Designs</title>
        <meta
          name="description"
          content={`Explore high-quality ${activeSub} logos — Premium, Standard, and Basic designs by Moon Designs.`}
        />
        <meta
          name="keywords"
          content={`${activeSub} logos, stream graphics, Moon Designs, animated logos, static logos`}
        />
      </Head>

      <div className="min-h-screen bg-white select-none text-gray-900">
        <div className="sticky top-20 z-40 backdrop-blur-md bg-white/30">
          <CategoriesNav />
        </div>

        <div className="p-6 pt-28">
          {/* Subtype buttons */}
          <div className="flex justify-center gap-3 mb-10">
            <HoverButton
              onClick={() => setActiveSub("static")}
              className={`border text-sm font-medium transition ${
                activeSub === "static"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-white"
              }`}
            >
              Static Logos
            </HoverButton>
            <HoverButton
              onClick={() => setActiveSub("animated")}
              className={`border text-sm font-medium transition ${
                activeSub === "animated"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-white"
              }`}
            >
              Animated Logos
            </HoverButton>
          </div>

          {/* Grid */}
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No {activeSub} logos found</p>
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
                  unoptimized
                  draggable={false}
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
