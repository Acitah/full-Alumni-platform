const mongoose = require("mongoose");

// Guild Schema Update (add `featured` to your existing guild model)
const guildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    memberCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }, // NEW
  },
  { timestamps: true },
);

const Guild = mongoose.model("Guild", guildSchema);

// Council Schema
const councilSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String },

    steward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nominatedSteward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    nominatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    memberCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    nominationOpen: { type: Boolean, default: false },
    nominationPeriod: {
      quarter: { type: String },
      opensAt: { type: Date },
      closesAt: { type: Date },
    },
  },
  { timestamps: true },
);

module.exports = {
  Council: mongoose.model("Council", councilSchema),
  Guild: mongoose.model("Guild", guildSchema),
};
