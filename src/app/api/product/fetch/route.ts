import { client } from "@/sanity/lib/client";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

interface SanityStreamGraphic {
  _id: string;
  title: string;
  subType?: string;
  category: string;
  price: number;
  image: string;
}


export async function GET(req: Request) {
  try {
    await connect();

    // Query params se ID lo agar diya ho
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Agar specific product chahiye
    if (id) {
      const product = await Product.findOne({ sanityId: id });
      if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // Sanity se data fetch karo
    const query = `*[_type == "streamgraphics"]{
      _id,
      title,
      subType,
      category,
      price,
      "image": image.asset->url
    }`;

    const sanityData = await client.fetch(query);

    if (!sanityData?.length) {
      return NextResponse.json({ message: "No Stream Graphics found in Sanity" });
    }

    // MongoDB ke liye data clean karo
const cleanData = sanityData.map((item: SanityStreamGraphic) => ({
  sanityId: item._id,
  title: item.title,
  category: item.category,
  subType: item.subType || "static",
  price: item.price,
  image: item.image,
  productType: "streamgraphics",
}));


    // Purana data delete karo
    await Product.deleteMany({});

    // Naya data insert karo
    const savedData = await Product.insertMany(cleanData, { ordered: false });

    return NextResponse.json({
      message: "Stream Graphics fetched and stored successfully",
      count: savedData.length,
      products: savedData,
    });

  } catch (error) {
    console.error("Error fetching Stream Graphics:", error);
    return NextResponse.json({ error: "Failed to fetch or save Stream Graphics" }, { status: 500 });
  }
}
