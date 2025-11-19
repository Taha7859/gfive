import mongoose from "mongoose";

const characterDesignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {              // 🔥 new field added
    type: Number,
    required: true,
  },
});

const CharacterDesign =
  mongoose.models.CharacterDesign ||
  mongoose.model("CharacterDesign", characterDesignSchema);

export default CharacterDesign;
