import mongoose from 'mongoose';

const googleSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
}, { timestamps: true });

const Google = mongoose.model('Google', googleSchema);

export default Google;
