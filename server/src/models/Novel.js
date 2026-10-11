import mongoose from 'mongoose';

const NovelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled Novel',
    },
    userId: {
      type: String,
      default: '',
      index: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'Anonymous Author',
    },
    genre: {
      type: String,
      default: 'Speculative Fiction',
    },
    synopsis: {
      type: String,
      default: '',
    },
    targetWordCount: {
      type: Number,
      default: 80000,
    },
    totalWordCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'First Draft', 'Revision', 'Completed'],
      default: 'In Progress',
    },
    theme: {
      fontFamily: { type: String, default: 'serif' }, // 'serif' | 'sans' | 'mono'
      lineHeight: { type: String, default: 'normal' }, // 'compact' | 'normal' | 'relaxed'
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Novel || mongoose.model('Novel', NovelSchema);
