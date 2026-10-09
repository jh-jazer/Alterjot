import Scene from '../models/Scene.js';
import Chapter from '../models/Chapter.js';
import Novel from '../models/Novel.js';
import { isConnectedToAtlas } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

export async function getScenes(req, res) {
  try {
    const { chapterId, novelId } = req.query;
    if (isConnectedToAtlas()) {
      const query = {};
      if (chapterId) query.chapterId = chapterId;
      if (novelId) query.novelId = novelId;
      const scenes = await Scene.find(query).sort({ order: 1 });
      return res.json({ success: true, data: scenes });
    }
    const scenes = memoryStore.getScenes(chapterId, novelId);
    return res.json({ success: true, data: scenes });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getSceneById(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const scene = await Scene.findById(id);
      if (!scene) return res.status(404).json({ success: false, error: 'Scene not found' });
      return res.json({ success: true, data: scene });
    }
    const scene = memoryStore.getSceneById(id);
    if (!scene) return res.status(404).json({ success: false, error: 'Scene not found' });
    return res.json({ success: true, data: scene });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createScene(req, res) {
  try {
    if (isConnectedToAtlas()) {
      const { novelId, chapterId, title, order, contentJson, plainText, wordCount, metadata, status } = req.body;
      const count = await Scene.countDocuments({ chapterId });
      const wc = Number(wordCount) || 0;
      const scene = await Scene.create({
        novelId,
        chapterId,
        title: title || `Scene ${count + 1}`,
        order: order !== undefined ? order : count + 1,
        contentJson,
        plainText: plainText || '',
        wordCount: wc,
        status: status || 'Draft',
        metadata: metadata || {},
      });

      if (wc > 0) {
        // Atomic $inc on parent novel document
        await Novel.findByIdAndUpdate(novelId, { $inc: { totalWordCount: wc } });
        await Chapter.findByIdAndUpdate(chapterId, { $inc: { totalWordCount: wc } });
      }

      return res.status(201).json({ success: true, data: scene });
    }

    const scene = memoryStore.createScene(req.body);
    return res.status(201).json({ success: true, data: scene });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateScene(req, res) {
  try {
    const { id } = req.params;

    if (isConnectedToAtlas()) {
      const current = await Scene.findById(id);
      if (!current) return res.status(404).json({ success: false, error: 'Scene not found' });

      const oldWords = current.wordCount || 0;
      const newWords = req.body.wordCount !== undefined ? Number(req.body.wordCount) : oldWords;
      const wordDelta = newWords - oldWords;

      const updated = await Scene.findByIdAndUpdate(
        id,
        {
          ...req.body,
          $set: {
            ...req.body,
            ...(req.body.metadata ? { metadata: { ...current.metadata, ...req.body.metadata } } : {}),
          },
        },
        { new: true }
      );

      // Incremental Aggregation: atomic $inc operation on the parent novel document
      if (wordDelta !== 0) {
        await Novel.findByIdAndUpdate(current.novelId, { $inc: { totalWordCount: wordDelta } });
        await Chapter.findByIdAndUpdate(current.chapterId, { $inc: { totalWordCount: wordDelta } });
      }

      return res.json({ success: true, data: updated, wordDelta });
    }

    const scene = memoryStore.updateScene(id, req.body);
    if (!scene) return res.status(404).json({ success: false, error: 'Scene not found' });
    return res.json({ success: true, data: scene });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function reorderScenes(req, res) {
  try {
    const { chapterId, orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, error: 'orderedIds must be an array' });
    }

    if (isConnectedToAtlas()) {
      const bulkOps = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, chapterId },
          update: { order: index + 1 },
        },
      }));
      await Scene.bulkWrite(bulkOps);
      const updated = await Scene.find({ chapterId }).sort({ order: 1 });
      return res.json({ success: true, data: updated });
    }

    const updated = memoryStore.reorderScenes(chapterId, orderedIds);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteScene(req, res) {
  try {
    const { id } = req.params;

    if (isConnectedToAtlas()) {
      const scene = await Scene.findById(id);
      if (!scene) return res.status(404).json({ success: false, error: 'Scene not found' });
      const words = scene.wordCount || 0;
      await Scene.findByIdAndDelete(id);
      if (words > 0) {
        await Novel.findByIdAndUpdate(scene.novelId, { $inc: { totalWordCount: -words } });
        await Chapter.findByIdAndUpdate(scene.chapterId, { $inc: { totalWordCount: -words } });
      }
      return res.json({ success: true, message: 'Scene deleted' });
    }

    const ok = memoryStore.deleteScene(id);
    if (!ok) return res.status(404).json({ success: false, error: 'Scene not found' });
    return res.json({ success: true, message: 'Scene deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
