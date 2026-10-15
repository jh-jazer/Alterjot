import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import Scene from '../models/Scene.js';
import User from '../models/User.js';
import { isConnectedToAtlas } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

export async function getNovels(req, res) {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId || '';
    const onlyPublished = req.query.published === 'true';

    if (isConnectedToAtlas()) {
      let query = {};
      if (onlyPublished) {
        query.isPublished = true;
      } else if (userId) {
        const userConditions = [{ userId }, { userId: '' }, { userId: { $exists: false } }];
        try {
          const user = await User.findOne({
            $or: [
              ...(userId.length === 24 ? [{ _id: userId }] : []),
              { googleId: userId },
              { email: (userId || '').toLowerCase() },
            ],
          });
          if (user) {
            userConditions.push({ userId: user._id.toString() });
            if (user.googleId) userConditions.push({ userId: user.googleId });
            if (user.penName) userConditions.push({ author: user.penName });
          }
        } catch {}

        query = { $or: userConditions };
      }
      const novels = await Novel.find(query).sort({ publishedAt: -1, updatedAt: -1 });
      return res.json({ success: true, data: novels });
    }

    let novels = memoryStore.getNovels(onlyPublished ? null : userId);
    if (onlyPublished) {
      novels = novels.filter((n) => n.isPublished);
    }
    return res.json({ success: true, data: novels });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getNovelById(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const novel = await Novel.findById(id);
      if (!novel) return res.status(404).json({ success: false, error: 'Novel not found' });
      return res.json({ success: true, data: novel });
    }
    const novel = memoryStore.getNovelById(id);
    if (!novel) return res.status(404).json({ success: false, error: 'Novel not found' });
    return res.json({ success: true, data: novel });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createNovel(req, res) {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || '';

    if (!userId || userId.startsWith('user_') || userId.startsWith('author_')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Guest accounts are not allowed.',
      });
    }

    if (isConnectedToAtlas()) {
      const user = await User.findOne({
        $or: [
          ...(userId.length === 24 ? [{ _id: userId }] : []),
          { googleId: userId },
          { email: (userId || '').toLowerCase() },
        ],
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authenticated author account not found. Please sign in.',
        });
      }

      const payload = {
        ...req.body,
        userId: user._id.toString(),
        author: user.penName || req.body.author || 'Author',
      };

      const novel = await Novel.create(payload);
      // create initial chapter & scene
      const chapter = await Chapter.create({
        novelId: novel._id,
        title: 'Chapter 1',
        order: 1,
        status: 'Draft',
      });
      await Scene.create({
        novelId: novel._id,
        chapterId: chapter._id,
        title: 'Scene 1',
        order: 1,
        status: 'Draft',
        plainText: '',
        contentJson: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
        wordCount: 0,
        characterCount: 0,
      });
      return res.status(201).json({ success: true, data: novel });
    }
    const novel = memoryStore.createNovel(payload);
    return res.status(201).json({ success: true, data: novel });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateNovel(req, res) {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || req.body.userId;
    if (isConnectedToAtlas()) {
      const existing = await Novel.findById(id);
      if (!existing) return res.status(404).json({ success: false, error: 'Novel not found' });
      if (existing.userId && userId && existing.userId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied: You do not own this book.' });
      }
      const novel = await Novel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      return res.json({ success: true, data: novel });
    }
    const novel = memoryStore.updateNovel(id, req.body);
    if (!novel) return res.status(404).json({ success: false, error: 'Novel not found' });
    return res.json({ success: true, data: novel });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function deleteNovel(req, res) {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (isConnectedToAtlas()) {
      const existing = await Novel.findById(id);
      if (!existing) return res.status(404).json({ success: false, error: 'Novel not found' });
      if (existing.userId && userId && existing.userId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied: You do not own this book.' });
      }
      await Novel.findByIdAndDelete(id);
      await Chapter.deleteMany({ novelId: id });
      await Scene.deleteMany({ novelId: id });
      return res.json({ success: true, message: 'Novel deleted' });
    }
    const ok = memoryStore.deleteNovel(id);
    if (!ok) return res.status(404).json({ success: false, error: 'Novel not found' });
    return res.json({ success: true, message: 'Novel deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportManuscript(req, res) {
  try {
    const { id } = req.params;
    const format = req.query.format === 'text' ? 'text' : 'markdown';

    if (isConnectedToAtlas()) {
      const novel = await Novel.findById(id);
      if (!novel) return res.status(404).json({ success: false, error: 'Novel not found' });
      const chapters = await Chapter.find({ novelId: id }).sort({ order: 1 });
      const scenes = await Scene.find({ novelId: id }).sort({ order: 1 });

      let output = '';
      if (format === 'markdown') {
        output += `# ${novel.title}\n`;
        if (novel.subtitle) output += `### ${novel.subtitle}\n`;
        output += `**By ${novel.author}**\n\n`;
        if (novel.synopsis) output += `> ${novel.synopsis}\n\n`;
        output += `---\n\n`;

        chapters.forEach((ch) => {
          output += `## ${ch.title}\n\n`;
          const chScenes = scenes.filter((s) => s.chapterId.toString() === ch._id.toString());
          chScenes.forEach((sc, sIdx) => {
            if (sc.title && sc.title !== ch.title) {
              output += `### ${sc.title}\n\n`;
            }
            if (sc.metadata?.povCharacter) {
              output += `*[POV: ${sc.metadata.povCharacter}]*\n\n`;
            }
            output += `${sc.plainText || ''}\n\n`;
            if (sIdx < chScenes.length - 1) {
              output += `* * *\n\n`;
            }
          });
          output += `\n`;
        });
      } else {
        output += `${novel.title.toUpperCase()}\n`;
        if (novel.subtitle) output += `${novel.subtitle}\n`;
        output += `By ${novel.author}\n\n=========================================\n\n`;

        chapters.forEach((ch) => {
          output += `\n\n${ch.title.toUpperCase()}\n-----------------------------------------\n\n`;
          const chScenes = scenes.filter((s) => s.chapterId.toString() === ch._id.toString());
          chScenes.forEach((sc, sIdx) => {
            output += `${sc.plainText || ''}\n\n`;
            if (sIdx < chScenes.length - 1) {
              output += `# # #\n\n`;
            }
          });
        });
      }

      return res.json({
        success: true,
        data: {
          title: novel.title,
          format,
          totalWordCount: novel.totalWordCount,
          content: output,
        },
      });
    }

    const bundled = memoryStore.bundleManuscript(id, format);
    if (!bundled) return res.status(404).json({ success: false, error: 'Novel not found' });
    return res.json({ success: true, data: bundled });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function incrementNovelViews(req, res) {
  try {
    const { id } = req.params;
    if (isConnectedToAtlas()) {
      const novel = await Novel.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
      if (!novel) return res.status(404).json({ success: false, error: 'Novel not found' });
      return res.json({ success: true, data: { views: novel.views } });
    }
    const views = memoryStore.incrementNovelViews(id);
    return res.json({ success: true, data: { views } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function rateNovel(req, res) {
  try {
    const { id } = req.params;
    const ratingValue = Number(req.body.rating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    if (isConnectedToAtlas()) {
      const novel = await Novel.findById(id);
      if (!novel) return res.status(404).json({ success: false, error: 'Novel not found' });

      const currentCount = novel.ratingCount || 0;
      const currentRating = novel.rating || 5.0;
      const totalScore = currentRating * currentCount + ratingValue;
      const nextCount = currentCount + 1;
      const nextRating = Math.round((totalScore / nextCount) * 10) / 10;

      novel.rating = nextRating;
      novel.ratingCount = nextCount;
      await novel.save();

      return res.json({ success: true, data: { rating: novel.rating, ratingCount: novel.ratingCount } });
    }

    const result = memoryStore.rateNovel(id, ratingValue);
    if (!result) return res.status(404).json({ success: false, error: 'Novel not found' });
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
