    import { defineType, defineField } from "sanity";

export default defineType({
  name: "logoBranding",
  title: "Logo & Branding",
  type: "document",
  fields: [
    // 🏷️ Logo / Brand Name
    defineField({
      name: "title",
      title: "Logo or Brand Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 📂 Category
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Logo Design", value: "logoDesign" },
          { title: "Brand Identity", value: "brandIdentity" }
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🖼️ Image upload
    defineField({
      name: "image",
      title: "Logo / Branding Image",
      type: "image",
      description: "Upload PNG, JPG, or SVG file of your design.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    // 🔗 Slug
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
