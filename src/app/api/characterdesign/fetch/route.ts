import { client } from "@/sanity/lib/client";
import { connect } from "@/dbConfig/dbConfig";
import CharacterDesign from "@/models/CharacterDesign";
import { NextResponse } from "next/server";

// 🔹 Interface add
interface SanityCharacterDesign {
  _id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await CharacterDesign.findOne({ sanityId: id });
      if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const query = `*[_type == "characterDesign"]{
      _id,
      title,
      category,
      price,
      "image": image.asset->url
    }`;

    const sanityData = await client.fetch(query);

    if (!sanityData?.length) {
      return NextResponse.json({ message: "No character designs found in Sanity" });
    }

    const cleanData = sanityData.map((item: SanityCharacterDesign) => ({
      sanityId: item._id,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
    }));

    await CharacterDesign.deleteMany({});
    const savedData = await CharacterDesign.insertMany(cleanData);

    return NextResponse.json({
      message: "Character designs fetched and stored successfully",
      count: savedData.length,
      products: savedData,
    });
  } catch (error) {
    console.error("Error fetching Character Designs:", error);
    return NextResponse.json({ error: "Failed to fetch or save character designs" }, { status: 500 });
  }
}
