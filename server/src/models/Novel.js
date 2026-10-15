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
    coverImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: 'English',
    },
    contentRating: {
      type: String,
      enum: ['All Audiences', 'Mature'],
      default: 'All Audiences',
    },
    copyright: {
      type: String,
      default: 'All Rights Reserved',
    },
    targetAudience: {
      type: String,
      default: 'Young Adult',
    },
    mainCharacters: {
      type: [String],
      default: [],
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
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Novel || mongoose.model('Novel', NovelSchema);
