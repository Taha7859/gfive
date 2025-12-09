import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  productPrice: { type: String, required: true }, // ✅ Changed to String agar aap price string mein store karte hain

  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  requirement: { type: String, required: true },
  additional: { type: String, default: "" },

  referenceFile: { type: String, default: "" },
  
  // ✅ CONFIRMED: Ye wala enum use karein
  status: { 
    type: String, 
    enum: [
      "pending",           // For Stripe payments
      "paid",             // Payment successful
      "cancelled",        // Order cancelled
      "payment_pending",  // For payment selection page
      "paypal_pending",   // PayPal payment initiated
      "failed"            // Payment failed
    ], 
    default: "pending" 
  },

  stripeSessionId: { type: String, default: "" },
  stripePaymentIntentId: { type: String, default: "" },
  
  paypalOrderId: { type: String, default: "" },
  paymentMethod: { 
    type: String, 
    enum: ["stripe", "paypal", ""], // ✅ Empty string allow karein
    default: "" 
  },
  paymentId: { type: String, default: "" },
  paidAt: { type: Date },
  paymentError: { type: String, default: "" },
  
}, { timestamps: true });

// ✅ Force delete existing model to reload
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model("Order", orderSchema);