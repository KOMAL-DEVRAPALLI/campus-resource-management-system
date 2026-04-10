import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  occupiedCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  type:{
    type: String,
    default:"General"
  }
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);