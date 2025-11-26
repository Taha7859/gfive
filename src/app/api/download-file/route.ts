import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";

connect();

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    // ✅ INPUT VALIDATION
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ 
        success: false, 
        message: "Valid order ID is required" 
      }, { status: 400 });
    }

    let order;
    try {
      order = await Order.findById(orderId);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ 
        success: false, 
        message: "Database error" 
      }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    if (!order.referenceFile) {
      return NextResponse.json({ 
        success: false, 
        message: "No file found for this order" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      fileData: order.referenceFile,
      fileName: `reference-${orderId}.${order.referenceFile.includes('pdf') ? 'pdf' : 
                order.referenceFile.includes('png') ? 'png' : 
                order.referenceFile.includes('jpeg') ? 'jpg' : 'bin'}`
    });

  } catch (error) {
    console.error("Download file error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}