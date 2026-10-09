import mongoose from 'mongoose';

const CodexEntrySchema = new mongoose.Schema(
  {
    novelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Novel',
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['Characters', 'Locations', 'Factions', 'Timeline'],
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    traits: {
      appearance: { type: String, default: '' },
      voice: { type: String, default: '' },
      quirks: { type: String, default: '' },
      background: { type: String, default: '' },
      significance: { type: String, default: '' },
    },
    // For timeline entries or location coordinates/relations
    timelineDate: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#8b5cf6',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexing as specified
CodexEntrySchema.index({ novelId: 1, category: 1, name: 1 });

export default mongoose.models.CodexEntry || mongoose.model('CodexEntry', CodexEntrySchema);
