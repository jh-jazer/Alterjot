import Chapter from '../models/Chapter.js';
import Scene from '../models/Scene.js';
import Novel from '../models/Novel.js';
import { isConnectedToAtlas } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

export async function getChapters(req, res) {
  try {
    const { novelId } = req.query;
    if (isConnectedToAtlas()) {
      const query = novelId ? { novelId } : {};
      const chapters = await Chapter.find(query).sort({ order: 1 });
      return res.json({ success: true, data: chapters });
    }
    const chapters = memoryStore.getChapters(novelId);
    return res.json({ success: true, data: chapters });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createChapter(req, res) {
  try {
    if (isConnectedToAtlas()) {
      const { novelId, title, order, status, synopsis } = req.body;
      const count = await Chapter.countDocuments({ novelId });
      const chapter = await Chapter.create({
        novelId,
        title: title || `Chapter ${count + 1}`,
        order: order !== undefined ? order : count + 1,
        status: status || 'Draft',
        synopsis: synopsis || '',
      });
      return res.status(201).json({ success: true, data: chapter });
    }
    const chapter = memoryStore.createChapter(req.body);
    return res.status(201).json({ success: true, data: chapter });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateChapter(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const chapter = await Chapter.findByIdAndUpdate(id, req.body, { new: true });
      if (!chapter) return res.status(404).json({ success: false, error: 'Chapter not found' });
      return res.json({ success: true, data: chapter });
    }
    const chapter = memoryStore.updateChapter(id, req.body);
    if (!chapter) return res.status(404).json({ success: false, error: 'Chapter not found' });
    return res.json({ success: true, data: chapter });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function reorderChapters(req, res) {
  try {
    const { novelId, orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, error: 'orderedIds must be an array' });
    }

    if (isConnectedToAtlas()) {
      const bulkOps = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, novelId },
          update: { order: index + 1 },
        },
      }));
      await Chapter.bulkWrite(bulkOps);
      const updated = await Chapter.find({ novelId }).sort({ order: 1 });
      return res.json({ success: true, data: updated });
    }

    const updated = memoryStore.reorderChapters(novelId, orderedIds);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteChapter(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const chapter = await Chapter.findById(id);
      if (!chapter) return res.status(404).json({ success: false, error: 'Chapter not found' });
      const novelId = chapter.novelId;
      await Chapter.findByIdAndDelete(id);
      await Scene.deleteMany({ chapterId: id });
      // Recalculate novel word count
      const allScenes = await Scene.find({ novelId });
      const total = allScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
      await Novel.findByIdAndUpdate(novelId, { totalWordCount: total });
      return res.json({ success: true, message: 'Chapter deleted' });
    }

    const ok = memoryStore.deleteChapter(id);
    if (!ok) return res.status(404).json({ success: false, error: 'Chapter not found' });
    return res.json({ success: true, message: 'Chapter deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
