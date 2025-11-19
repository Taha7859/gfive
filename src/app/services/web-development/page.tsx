"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";

type PortfolioItem = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  gallery?: { url: string }[];
};

export default function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(`
        *[_type == "portfolio"] | order(_createdAt asc){
          _id,
          title,
          description,
          projectUrl,
          "imageUrl": image.asset->url,
          "gallery": gallery[].asset->{"url": url}
        }
      `);
      setProjects(data);
    };
    fetchData();
  }, []);

  const openGallery = (project: PortfolioItem) => {
    const allImages = [
      project.imageUrl,
      ...(project.gallery?.map((img) => img.url) || []),
    ];
    setCurrentGallery(allImages);
    setCurrentIndex(0);
    setSelectedTitle(project.title);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
    setCurrentGallery([]);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === currentGallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? currentGallery.length - 1 : prev - 1
    );
  };

  return (
    <section
      className="py-32 px-6 md:px-12 bg-white relative"
      aria-label="Portfolio Section"
    >
      <div className="text-center mb-14">
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-[2px] bg-[#0f172a]" />
          <p className="text-[#0f172a] font-semibold uppercase tracking-wide">
            Complete Project
          </p>
          <div className="w-16 h-[2px] bg-[#0f172a]" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 leading-tight">
          Look At My Portfolio And Give Me Your Feedback
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => (
          <article
            key={project._id}
            className="rounded-2xl bg-gray-50 overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="relative w-full h-64">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover rounded-t-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-[#0f172a]">
                  {project.title}
                </h3>

                {project.gallery && project.gallery.length > 0 && (
                  <button
                    onClick={() => openGallery(project)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0f172a] text-white hover:bg-white hover:text-[#0f172a] transition-all duration-300 shadow-md"
                    aria-label={`Open gallery for ${project.title}`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              <p className="text-gray-800 font-medium text-sm leading-relaxed">
                {project.description}
              </p>

              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-center bg-[#091f52] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#0e1a36] transition-all duration-300 shadow-md"
                >
                  Visit Project
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-50 backdrop-blur-md bg-black/60 p-4 transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
            aria-label="Close Gallery"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-white text-2xl font-bold mb-6 text-center">
            {selectedTitle}
          </h2>

          <div className="relative w-full max-w-3xl h-[70vh] flex items-center justify-center">
            <Image
              src={currentGallery[currentIndex]}
              alt={`${selectedTitle} image ${currentIndex + 1}`}
              fill
              className="object-contain rounded-lg shadow-lg transition-opacity duration-500"
              loading="eager"
              priority
              unoptimized
            />
          </div>

          <button
            onClick={prevImage}
            className="absolute left-6 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <p className="text-white mt-4 text-sm">
            {currentIndex + 1} / {currentGallery.length}
          </p>
        </div>
      )}
    </section>
  );
}


// export default function PortfolioSection() {
//   return <div>
//     hello
//   </div>
// }