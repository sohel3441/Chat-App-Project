import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // optional for social login
    provider: { type: String, default: 'local' }, // e.g., 'google', 'facebook'
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
 