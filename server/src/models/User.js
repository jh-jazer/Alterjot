import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    penName: {
      type: String,
      required: true,
      trim: true,
      default: 'Author',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['google', 'local', 'guest'],
      default: 'google',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
