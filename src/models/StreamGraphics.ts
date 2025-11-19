import mongoose from "mongoose";

const streamGraphicsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subType: {
    type: String,
    enum: ["static", "animated"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const StreamGraphics =
  mongoose.models.StreamGraphics ||
  mongoose.model("StreamGraphics", streamGraphicsSchema);

export default StreamGraphics;
