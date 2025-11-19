import { client } from "@/sanity/lib/client";

export const getProductData = async () => {
  return await client.fetch(`*[_type == "product" ] {
  name,
  "image_url":image.asset->.url,
    price,
  description,
  discountPercentage,
  stockLevel,
  category,
  "slug":slug.current
}

`);
};