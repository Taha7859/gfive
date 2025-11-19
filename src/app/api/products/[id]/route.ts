import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const query = `*[_id == "${id}"][0]{
      _id,
      title,
      price,
      image
    }`;
    const product = await client.fetch(query);
    return NextResponse.json(product);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" });
  }
}
