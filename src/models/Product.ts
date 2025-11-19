import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sanityId: { type: String }, // Sanity ID store karne ke liye
  title: { type: String, required: true },
  category: { type: String, required: true },
  subType: { type: String, default: "static" },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  productType: { 
    type: String, 
    enum: ["streamgraphics", "characterDesign"], 
    required: true 
  },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
