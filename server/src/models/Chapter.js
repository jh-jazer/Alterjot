import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema(
  {
    novelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Novel',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Chapter',
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Draft', 'In Review', 'Final'],
      default: 'Draft',
    },
    synopsis: {
      type: String,
      default: '',
    },
    totalWordCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexing as specified
ChapterSchema.index({ novelId: 1, order: 1 });

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
