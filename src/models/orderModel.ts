import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },         // Sanity id or product identifier
  productTitle: { type: String, required: true },
  productPrice: { type: Number, required: true },

  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  requirement: { type: String, required: true },
  additional: { type: String, default: "" },

  referenceFile: { type: String, default: "" }, // local path or uploaded URL
  status: { type: String, enum: ["pending","paid","cancelled"], default: "pending" },

  stripeSessionId: { type: String, default: "" },
  stripePaymentIntentId: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
