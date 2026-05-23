const mongoose = require("mongoose");

// Opportunity/Job Post
const opportunitySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    type: {
      type: String,
      enum: ["job", "internship"],
      default: "job",
      required: true,
    },
    workType: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      default: "remote",
    },
    company: { type: String, required: true },
    location: { type: String, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    closingDate: { type: Date, required: true },
    referralOffer: { type: String, required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    karmaReward: { type: Number, default: 15 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

opportunitySchema.virtual("badge").get(function () {
  const now = Date.now();
  const hoursLeft = (this.closingDate - now) / 3_600_000;
  const ageInDays = (now - this.createdAt) / 86_400_000;

  if (hoursLeft <= 0) return "Closed";
  if (hoursLeft <= 48) return `Ends in ${Math.ceil(hoursLeft)} hours`;
  if (ageInDays <= 3) return "New";
  return null;
});

// make virtuals show up in JSON responses
opportunitySchema.set("toJSON", { virtuals: true });
opportunitySchema.set("toObject", { virtuals: true });

// Application
const applicationSchema = mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "referred", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true },
);

module.exports = {
  Opportunity: mongoose.model("Opportunity", opportunitySchema),
  Application: mongoose.model("Application", applicationSchema),
};
