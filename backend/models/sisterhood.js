const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
// // Coffee Roulette
// const coffeeRouletteSchema = mongoose.Schema({
//   user: { type: ObjectId, ref: 'User', required: true },
//   matchedWith: { type: ObjectId, ref: 'User' },
//   status: {
//     type: String,
//     enum: ['pending', 'matched', 'completed'],
//     default: 'pending'
//   },
//   karmaCost: { type: Number, default: 10 },
//   scheduledDate: { type: Date }
// }, { timestamps: true });

// Sisterhood Fridays Events
const sisterEventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    hostedBy: { type: ObjectId, ref: "User" },
    cohort: { type: Number },
    date: { type: Date, required: true },
    rsvps: [{ type: ObjectId, ref: "User" }],
    karmaReward: { type: Number, default: 5 },
  },
  { timestamps: true },
);

// Shoutout Wall
const shoutoutSchema = mongoose.Schema(
  {
    recipient: { type: ObjectId, ref: "User", required: true },
    sender: { type: ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    celebrations: [{ type: ObjectId, ref: "User" }],
    karmaReward: { type: Number, default: 2 },
    comments: [
      {
        user: { type: ObjectId, ref: "User" },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = {
  // CoffeeRoulette: mongoose.model('CoffeeRoulette', coffeeRouletteSchema),
  SisterEvent: mongoose.model("SisterEvent", sisterEventSchema),
  Shoutout: mongoose.model("Shoutout", shoutoutSchema),
};
