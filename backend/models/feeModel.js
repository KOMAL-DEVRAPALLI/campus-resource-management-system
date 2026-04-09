import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  transactionId: {
    type: String,
  },

  // 🔥 NEW (your differentiation)
  bookingDate: {
    type: Date,
  },
  timeSlot: {
    type: String,
  }

}, { timestamps: true });

feeSchema.index(
  { studentId: 1, month: 1 },
  { unique: true }
);

export default mongoose.model("Fee", feeSchema);