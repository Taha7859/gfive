// const productSchema = {
//   name: 'streamgraphics',
//   type: 'document',
//   title: 'streamgraphics',
//   fields: [



//     {
//       name: 'image',
//       type: 'image',
//       title: 'Image',
//       options: {
//         hotspot: true,
//       },
//     },
//     {
//       name: 'price',
//       type: 'number',
//       title: 'Price',
//     },
//     {
  //       name: 'category',
//       type: 'string',
//       title: 'Category',
//     },
//     {
//       name: 'slug',
//       type: 'slug',
//       title: 'Slug',
//     },
//   ],
// };

// export default productSchema;

// const productSchema = {
  //   name: 'streamgraphics',
  //   title: 'Stream Graphics',
//   type: 'document',
//   fields: [
//     {
//       name: 'title',
//       type: 'string',
//       title: 'Title',
//     },
//     {
//       name: 'image',
//       type: 'image',
//       title: 'Image',
//       options: { hotspot: true },
//     },
//     {
//       name: 'price',
//       type: 'number',
//       title: 'Price',
//     },
//     {
//       name: 'category',
//       type: 'string',
//       title: 'Category', // Logo, Banners, Stream Pack, Alerts, emotes
//     },
//     {
//       name: 'subType',
//       type: 'string',
//       title: 'Sub Type',
//       options: {
//         list: [
//           { title: 'Static', value: 'static' },
//           { title: 'Animated', value: 'animated' },
//         ],
//       },
//     },
//     {
//       name: 'slug',
//       type: 'slug',
//       title: 'Slug',
//     },
//   ],
// };

// export default productSchema;



// sanity/schemas/product.ts

// const productSchema = {
//   name: 'streamgraphics',         // Document type ka naam (query me _type yahi hoga)
//   title: 'Stream Graphics',        // Studio me collection ka naam
//   type: 'document',
//   fields: [
//     {
//       name: 'title',
//       type: 'string',
//       title: 'Title',              // e.g. Animated Logo 01
//       validation: (Rule: Rule) => Rule.required().min(2),
//     },
//     {
//       name: 'image',
//       type: 'image',
//       title: 'Image / GIF',
//       description: 'Upload PNG, JPG ya GIF (animated logo ke liye GIF best hai)',
//       options: { hotspot: true },
//       validation: (Rule: Rule) => Rule.required(),
//     },
//     {
//       name: 'price',
//       type: 'number',
//       title: 'Price',
//       validation: (Rule: Rule) => Rule.min(0),
//     },
//     {
//       name: 'category',
//       type: 'string',
//       title: 'Category',           // Logo, Banners, Stream Pack, Alerts, emotes
//       options: {
//         list: [
//           { title: 'Logo', value: 'Logo' },
//           { title: 'Banners', value: 'Banners' },
//           { title: 'Stream Pack', value: 'Stream Pack' },
//           { title: 'Alerts', value: 'Alerts' },
//           { title: 'Emotes', value: 'emotes' },
//         ],
//       },
//       validation: (Rule: Rule) => Rule.required(),
//     },
//     {
//       name: 'subType',
//       type: 'string',
//       title: 'Sub Type',           // Static / Animated
//       options: {
//         list: [
//           { title: 'Static', value: 'static' },
//           { title: 'Animated', value: 'animated' },
//         ],
//       },
//       validation: (Rule: Rule) => Rule.required(),
//     },
//     {
//       name: 'slug',
//       type: 'slug',
//       title: 'Slug',
//       options: {
//         source: 'title',
//         maxLength: 96,
//       },
//       validation: (Rule: Rule) => Rule.required(),
//     },
//     // Optional: Agar future me video chahiye
//     // {
//     //   name: 'video',
//     //   type: 'file',
//     //   title: 'Video (optional)',
//     //   options: { accept: 'video/*' },
//     // },
//   ],
// };

// export default productSchema;


// ALL SET
import { Rule } from "sanity";

const productSchema = {
  name: "streamgraphics",
  title: "Stream Graphics",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule: Rule) => Rule.required().min(2),
    },
    {
      name: "image",
      type: "image",
      title: "Image / GIF",
      description: "Upload PNG, JPG ya GIF (animated ke liye GIF best hai)",
      options: { hotspot: true },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "category",
      type: "string",
      title: "Category",
      options: {
        list: [
          { title: "Logo", value: "Logo" },
          { title: "Banners", value: "Banners" },
          { title: "Stream Pack", value: "Stream Pack" },
          { title: "Alerts", value: "Alerts" },
          { title: "Emotes", value: "Emotes" },
          { title: "Panel", value: "Panel" },
          { title: "Sub Badges", value: "Sub Badges" },
          { title: "Overlay", value: "Overlay" },
          { title: "V Tuber", value: "V Tuber" },
          { title: "PNG Tuber", value: "PNG Tuber" },
          { title: "VR Chat", value: "VR Chat" },
        ],
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "subType",
      type: "string",
      title: "Sub Type", // Static / Animated
      options: {
        list: [
          { title: "Static", value: "static" },
          { title: "Animated", value: "animated" },
        ],
      },
      validation: (Rule: Rule) => Rule.required(),
    },

    // ✅ Added Price field
    {
      name: "price",
      title: "Price",
      type: "number",
      description: "Set a price for this stream graphic (in USD)",
      validation: (Rule: Rule) => Rule.required().positive().precision(2),
    },
  ],
};

export default productSchema;
