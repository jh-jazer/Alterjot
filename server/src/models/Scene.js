import mongoose from 'mongoose';

const SceneSchema = new mongoose.Schema(
  {
    novelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Novel',
      required: true,
      index: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Scene',
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    contentJson: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      }),
    },
    plainText: {
      type: String,
      default: '',
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    characterCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'In Review', 'Final'],
      default: 'Draft',
    },
    metadata: {
      povCharacter: { type: String, default: '' },
      inUniverseDate: { type: String, default: '' },
      objective: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexing as specified
SceneSchema.index({ chapterId: 1, order: 1 });
SceneSchema.index({ plainText: 'text', title: 'text' });

export default mongoose.models.Scene || mongoose.model('Scene', SceneSchema);
