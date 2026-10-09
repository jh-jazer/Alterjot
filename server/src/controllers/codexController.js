import CodexEntry from '../models/CodexEntry.js';
import { isConnectedToAtlas } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

export async function getCodex(req, res) {
  try {
    const { novelId, category } = req.query;
    if (isConnectedToAtlas()) {
      const query = {};
      if (novelId) query.novelId = novelId;
      if (category) query.category = category;
      const entries = await CodexEntry.find(query).sort({ name: 1 });
      return res.json({ success: true, data: entries });
    }
    const entries = memoryStore.getCodex(novelId, category);
    return res.json({ success: true, data: entries });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getCodexById(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const entry = await CodexEntry.findById(id);
      if (!entry) return res.status(404).json({ success: false, error: 'Codex entry not found' });
      return res.json({ success: true, data: entry });
    }
    const entry = memoryStore.getCodexById(id);
    if (!entry) return res.status(404).json({ success: false, error: 'Codex entry not found' });
    return res.json({ success: true, data: entry });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createCodex(req, res) {
  try {
    if (isConnectedToAtlas()) {
      const entry = await CodexEntry.create(req.body);
      return res.status(201).json({ success: true, data: entry });
    }
    const entry = memoryStore.createCodex(req.body);
    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateCodex(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const entry = await CodexEntry.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!entry) return res.status(404).json({ success: false, error: 'Codex entry not found' });
      return res.json({ success: true, data: entry });
    }
    const entry = memoryStore.updateCodex(id, req.body);
    if (!entry) return res.status(404).json({ success: false, error: 'Codex entry not found' });
    return res.json({ success: true, data: entry });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function deleteCodex(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const entry = await CodexEntry.findByIdAndDelete(id);
      if (!entry) return res.status(404).json({ success: false, error: 'Codex entry not found' });
      return res.json({ success: true, message: 'Codex entry deleted' });
    }
    const ok = memoryStore.deleteCodex(id);
    if (!ok) return res.status(404).json({ success: false, error: 'Codex entry not found' });
    return res.json({ success: true, message: 'Codex entry deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
