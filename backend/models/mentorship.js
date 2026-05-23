const mongoose = require("mongoose");

// Mentor Profile
const mentorSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offers: [{ type: String }],
    asks: [{ type: String }], // UI/UX Insight etc
    availability: { type: Boolean, default: true },
    karmaCost: { type: Number, default: 15 },
    totalSessions: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = {
  Mentor: mongoose.model("Mentor", mentorSchema),
};
