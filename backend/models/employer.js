const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Employer/Partner
const employerSchema = mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSubscribed: { type: Boolean, default: false },
    subscriptionType: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },
    jobsPosted: [{ type: ObjectId, ref: "Opportunity" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employer", employerSchema);
