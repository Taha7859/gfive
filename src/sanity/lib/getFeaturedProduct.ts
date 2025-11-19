import { client } from "@/sanity/lib/client";

export const getFeadturedData = async () => {
  return await client.fetch(`*[_type == "product" && isFeaturedProduct == true][0..3] {
  name,
  "image_url":image.asset->.url,
  price,
  description,
  discountPercentage,
  stockLevel,
  category,
 "slug":slug.current

}`);
};
