import { NextResponse } from "next/server";
import Subscriber from "@/models/subscriberModel";
import { Resend } from "resend";
import { connect } from "@/dbConfig/dbConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  await connect();

  try {
    const { email } = await req.json();

    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Check duplicate
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    // ✅ Save to MongoDB
    await Subscriber.create({ email });

    // ✅ Send email
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: "Subscription Successful",
      html: `<h2>Thanks for subscribing 🎉</h2>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("❌ Subscribe Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
