// Initiative Incubator
const initiativeSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pitchedBy: { type: ObjectId, ref: 'User', required: true },
  votes: [{ type: ObjectId, ref: 'User' }],
  voteCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pitched', 'approved', 'rejected', 'active'],
    default: 'pitched'
  },
  karmaCost: { type: Number, default: 20 }
}, { timestamps: true });

// Community Council Elections
const electionSchema = mongoose.Schema({
  candidate: { type: ObjectId, ref: 'User', required: true },
  role: { type: String, required: true }, // Head of Mentorship etc
  cohort: { type: Number },
  votes: [{ type: ObjectId, ref: 'User' }],
  voteCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  karmaPerVote: { type: Number, default: 2 }
}, { timestamps: true });

// Special Interest Guilds
const guildSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: ObjectId, ref: 'User' }],
  leader: { type: ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'data', 'design', 'career', 'other']
  },
  memberCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  Initiative: mongoose.model('Initiative', initiativeSchema),
  Election: mongoose.model('Election', electionSchema),
  Guild: mongoose.model('Guild', guildSchema)
};