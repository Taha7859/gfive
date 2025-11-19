import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  productPrice: { type: Number, required: true },

  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  requirement: { type: String, required: true },
  additional: { type: String },
  fileName: { type: String },

  createdAt: { type: Date, default: Date.now },
});

const Request =
  mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;
