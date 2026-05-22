// Employer/Partner
const employerSchema = mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSubscribed: { type: Boolean, default: false },
  subscriptionType: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  jobsPosted: [{ type: ObjectId, ref: 'Opportunity' }]
}, { timestamps: true });

// Talent Introduction Request
const introRequestSchema = mongoose.Schema({
  employer: { type: ObjectId, ref: 'Employer', required: true },
  talent: { type: ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  message: { type: String }
}, { timestamps: true });