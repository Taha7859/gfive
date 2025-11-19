import { defineType, defineField } from "sanity";

export default defineType({
  name: "characterDesign",
  title: "Character Design",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Character Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Anime", value: "anime" },
          { title: "Furry Art", value: "furryArt" },
          { title: "DnD", value: "dnd" },
          { title: "Character Art", value: "characterArt" },
          { title: "Cartoon Characters", value: "cartoonCharacters" },
          { title: "Chibi Characters", value: "chibiCharacters" },
          { title: "Concept Art Characters", value: "conceptArtCharacters" },
          { title: "Cover Art", value: "coverArt" },
          { title: "Dark Fantasy Character", value: "darkFantasyCharacter" },
          { title: "Fantasy Characters", value: "fantasyCharacters" },
          { title: "Furry Anthropomorphic Characters", value: "furryAnthropomorphicCharacters" },
          { title: "Kawaii Characters", value: "kawaiiCharacters" },
          { title: "Mascot Characters", value: "mascotCharacters" },
          { title: "Pixel Art Characters", value: "pixelArtCharacters" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description: "Upload PNG or JPG image only.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
     defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Set a price for this character design (in USD)",
      validation: (Rule) => Rule.required().positive().precision(2),
    })

   
  ],
});
