import { client } from "@/sanity/lib/client";
import { connect } from "@/dbConfig/dbConfig";
import StreamGraphics from "@/models/StreamGraphics";

export async function GET() {
  try {
    await connect();

    const query = `*[_type == "streamgraphics"]{
      title,
      category,
      subType,
      "slug": slug.current,
      "image": image.asset->url
    }`;

    const sanityData = await client.fetch(query);

    if (!sanityData?.length) {
      return Response.json({ message: "No stream graphics found in Sanity" });
    }

    // purane data ko delete karke naye insert kar rahe hain
    await StreamGraphics.deleteMany({});
    await StreamGraphics.insertMany(sanityData);

    return Response.json({
      message: "Stream graphics fetched and stored successfully",
      count: sanityData.length,
    });
  } catch (error) {
    console.error("Error fetching Stream Graphics:", error);
    return Response.json({ error: "Failed to fetch or save stream graphics" });
  }
}
