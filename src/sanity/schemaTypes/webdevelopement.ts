import { defineType, defineField } from "sanity";

export default defineType({
  name: "portfolio",
  title: "Portfolio Projects",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image" }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "projectUrl",
      title: "Project URL",
      type: "url",
      description: "Add the live link of your project (e.g. https://example.com)",
    }),
  ],
});
