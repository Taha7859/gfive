// import Link from "next/link"
// import Image from "next/image"

// const services = [
//   {
//     title: "Stream Graphics",
//     image: "/STREAMER-GRAPHICS.jpg",
//     link: "/services/graphics",
//   },
//   {
//     title: "Character Design",
//     image: "/Character-art.jpg",
//     link: "/services/character-design",
//   },
//   {
//     title: "Logo & Branding",
//     image: "/Business logo-and-brandinga.jpg",
//     link: "/services/logo-branding",
//   },
//   {
//     title: "Web Development",
//     image: "/websit.jpg",
//     link: "/services/web-development",
//   },
// ]

// export default function Services() {
//   return (
//     <section id="services" className="px-6 py-20 bg-gray-50 min-h-screen flex items-center justify-center">
//       <div className="max-w-6xl mx-auto w-full">
//         <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
//           Our Services
//         </h2>

//         <div className="grid md:grid-cols-2 gap-8">
//           {services.map((service, index) => (
//             <Link key={index} href={service.link}>
//               <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer">
//                 <Image
//                   src={service.image}
//                   alt={service.title}
//                   fill
//                   className="object-cover group-hover:scale-105 transition-transform duration-300"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   priority
//                 />
                
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }


import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Stream Graphics",
    image: "/STREAMER-GRAPHICS.jpg",
    link: "/services/graphics",
  },
  {
    title: "Character Design",
    image: "/Character-art.jpg",
    link: "/services/character-design",
  },
  {
    title: "Logo & Branding",
    image: "/Business logo-and-brandinga.jpg",
    link: "/services/logo-branding",
  },
  {
    title: "Web Development",
    image: "/websit.jpg",
    link: "/services/web-development",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="px-4 sm:px-6 py-16 md:py-20 bg-gray-50 min-h-screen flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12 md:mb-16">
          Our Services
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link key={index} href={service.link} aria-label={service.title}>
              <div className="relative w-full h-36 sm:h-64 md:h-72 rounded-xl overflow-hidden shadow-lg  group cursor-pointer lg:h-64 ">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-contain sm:object-contain md:object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
