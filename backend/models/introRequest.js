const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Talent Introduction Request
const introRequestSchema = mongoose.Schema(
  {
    employer: { type: ObjectId, ref: "Employer", required: true },
    talent: { type: ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    message: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("IntroRequest", introRequestSchema);
