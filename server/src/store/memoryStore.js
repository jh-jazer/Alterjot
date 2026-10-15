class MemoryStore {
  constructor() {
    this.novels = [];
    this.chapters = [];
    this.scenes = [];
    this.codex = [];
    this.users = [];
    console.log('⚡ [MemoryStore] Initialized clean library with zero sample data.');
  }

  // --- USERS / AUTH ---
  findUserByGoogleId(googleId) {
    return this.users.find((u) => u.googleId === googleId);
  }

  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id);
  }

  createOrUpdateGoogleUser({ googleId, email, penName, avatarUrl }) {
    let user = this.findUserByGoogleId(googleId) || this.findUserByEmail(email);
    const now = new Date().toISOString();
    if (user) {
      user.googleId = googleId;
      if (penName && (!user.penName || user.penName === 'Author')) {
        user.penName = penName;
      }
      if (avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
      user.updatedAt = now;
      return user;
    }

    user = {
      _id: 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      googleId,
      email: (email || '').toLowerCase(),
      penName: penName || (email ? email.split('@')[0] : 'Author'),
      avatarUrl: avatarUrl || '',
      authProvider: 'google',
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return user;
  }


  // --- NOVELS ---
  getNovels(userId) {
    let list = this.novels;
    if (userId) {
      list = list.filter((n) => !n.userId || n.userId === userId);
    }
    return list.map((n) => {
      const chapterCount = this.chapters.filter((c) => c.novelId === n._id).length;
      const sceneCount = this.scenes.filter((s) => s.novelId === n._id).length;
      return {
        ...n,
        chapterCount,
        sceneCount,
      };
    });
  }

  getNovelById(id) {
    return this.novels.find((n) => n._id === id);
  }

  createNovel(data) {
    const novel = {
      _id: 'novel_' + Date.now(),
      title: data.title || 'Untitled Book',
      userId: data.userId || '',
      subtitle: data.subtitle || '',
      author: data.author || '',
      genre: data.genre || 'General Fiction',
      synopsis: data.synopsis || '',
      targetWordCount: Number(data.targetWordCount) || 80000,
      totalWordCount: 0,
      status: data.status || 'In Progress',
      theme: data.theme || { fontFamily: 'serif', lineHeight: 'normal' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.novels.push(novel);

    // Create a clean initial Chapter 1 and blank Scene 1 so the author can jump right into drafting
    const chapter = this.createChapter({
      novelId: novel._id,
      title: 'Chapter 1',
      order: 1,
      status: 'Draft',
    });

    this.createScene({
      novelId: novel._id,
      chapterId: chapter._id,
      title: 'Scene 1',
      order: 1,
      status: 'Draft',
      contentJson: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      },
      plainText: '',
      wordCount: 0,
      characterCount: 0,
    });

    return novel;
  }

  updateNovel(id, data) {
    const index = this.novels.findIndex((n) => n._id === id);
    if (index === -1) return null;
    this.novels[index] = {
      ...this.novels[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.novels[index];
  }

  deleteNovel(id) {
    const index = this.novels.findIndex((n) => n._id === id);
    if (index === -1) return false;
    this.novels.splice(index, 1);
    this.chapters = this.chapters.filter((c) => c.novelId !== id);
    this.scenes = this.scenes.filter((s) => s.novelId !== id);
    this.codex = this.codex.filter((cd) => cd.novelId !== id);
    return true;
  }

  incrementNovelWordCount(novelId, delta) {
    const novel = this.getNovelById(novelId);
    if (novel) {
      novel.totalWordCount = Math.max(0, (novel.totalWordCount || 0) + delta);
      novel.updatedAt = new Date().toISOString();
    }
  }

  incrementNovelViews(novelId) {
    const novel = this.getNovelById(novelId);
    if (novel) {
      novel.views = (novel.views || 0) + 1;
      novel.updatedAt = new Date().toISOString();
      return novel.views;
    }
    return 0;
  }

  rateNovel(novelId, userRating) {
    const novel = this.getNovelById(novelId);
    if (novel) {
      const currentCount = novel.ratingCount || 0;
      const currentRating = novel.rating || 5.0;
      const totalScore = currentRating * currentCount + userRating;
      const nextCount = currentCount + 1;
      const nextRating = Math.round((totalScore / nextCount) * 10) / 10;
      novel.rating = nextRating;
      novel.ratingCount = nextCount;
      novel.updatedAt = new Date().toISOString();
      return { rating: novel.rating, ratingCount: novel.ratingCount };
    }
    return null;
  }

  // --- CHAPTERS ---
  getChapters(novelId) {
    return this.chapters
      .filter((c) => !novelId || c.novelId === novelId)
      .sort((a, b) => a.order - b.order);
  }

  getChapterById(id) {
    return this.chapters.find((c) => c._id === id);
  }

  createChapter(data) {
    const siblings = this.getChapters(data.novelId);
    const chapter = {
      _id: 'chapter_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      novelId: data.novelId,
      title: data.title || `Chapter ${siblings.length + 1}`,
      order: data.order !== undefined ? data.order : siblings.length + 1,
      status: data.status || 'Draft',
      synopsis: data.synopsis || '',
      totalWordCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.chapters.push(chapter);
    return chapter;
  }

  updateChapter(id, data) {
    const index = this.chapters.findIndex((c) => c._id === id);
    if (index === -1) return null;
    this.chapters[index] = {
      ...this.chapters[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.chapters[index];
  }

  reorderChapters(novelId, orderedIds) {
    orderedIds.forEach((id, idx) => {
      const chapter = this.chapters.find((c) => c._id === id && c.novelId === novelId);
      if (chapter) {
        chapter.order = idx + 1;
        chapter.updatedAt = new Date().toISOString();
      }
    });
    return this.getChapters(novelId);
  }

  deleteChapter(id) {
    const chapter = this.getChapterById(id);
    if (!chapter) return false;
    const novelId = chapter.novelId;
    this.chapters = this.chapters.filter((c) => c._id !== id);
    // remove scenes
    this.scenes = this.scenes.filter((s) => s.chapterId !== id);
    // recalculate novel words
    this.recalculateNovelWords(novelId);
    return true;
  }

  // --- SCENES ---
  getScenes(chapterId, novelId) {
    let result = this.scenes;
    if (chapterId) result = result.filter((s) => s.chapterId === chapterId);
    if (novelId) result = result.filter((s) => s.novelId === novelId);
    return result.sort((a, b) => a.order - b.order);
  }

  getSceneById(id) {
    return this.scenes.find((s) => s._id === id);
  }

  createScene(data) {
    const siblings = this.getScenes(data.chapterId);
    const scene = {
      _id: 'scene_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      novelId: data.novelId,
      chapterId: data.chapterId,
      title: data.title || `Scene ${siblings.length + 1}`,
      order: data.order !== undefined ? data.order : siblings.length + 1,
      status: data.status || 'Draft',
      contentJson: data.contentJson || {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      },
      plainText: data.plainText || '',
      wordCount: data.wordCount || 0,
      characterCount: data.characterCount || 0,
      metadata: data.metadata || {
        povCharacter: '',
        inUniverseDate: '',
        objective: '',
        notes: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.scenes.push(scene);
    if (scene.wordCount > 0) {
      this.incrementNovelWordCount(scene.novelId, scene.wordCount);
    }
    return scene;
  }

  updateScene(id, data) {
    const index = this.scenes.findIndex((s) => s._id === id);
    if (index === -1) return null;
    const oldScene = this.scenes[index];
    const oldWords = oldScene.wordCount || 0;
    const newWords = data.wordCount !== undefined ? data.wordCount : oldWords;
    const wordDelta = newWords - oldWords;

    this.scenes[index] = {
      ...oldScene,
      ...data,
      metadata: {
        ...oldScene.metadata,
        ...(data.metadata || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    if (wordDelta !== 0) {
      this.incrementNovelWordCount(oldScene.novelId, wordDelta);
      // Update chapter total words
      const chapter = this.getChapterById(oldScene.chapterId);
      if (chapter) {
        chapter.totalWordCount = Math.max(0, (chapter.totalWordCount || 0) + wordDelta);
      }
    }

    return this.scenes[index];
  }

  reorderScenes(chapterId, orderedIds) {
    orderedIds.forEach((id, idx) => {
      const scene = this.scenes.find((s) => s._id === id && s.chapterId === chapterId);
      if (scene) {
        scene.order = idx + 1;
        scene.updatedAt = new Date().toISOString();
      }
    });
    return this.getScenes(chapterId);
  }

  deleteScene(id) {
    const scene = this.getSceneById(id);
    if (!scene) return false;
    const novelId = scene.novelId;
    const words = scene.wordCount || 0;
    this.scenes = this.scenes.filter((s) => s._id !== id);
    if (words > 0) {
      this.incrementNovelWordCount(novelId, -words);
    }
    return true;
  }

  recalculateNovelWords(novelId) {
    const novelScenes = this.scenes.filter((s) => s.novelId === novelId);
    const total = novelScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
    const novel = this.getNovelById(novelId);
    if (novel) {
      novel.totalWordCount = total;
    }
    return total;
  }

  // --- CODEX ---
  getCodex(novelId, category) {
    let result = this.codex;
    if (novelId) result = result.filter((c) => c.novelId === novelId);
    if (category) result = result.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  getCodexById(id) {
    return this.codex.find((c) => c._id === id);
  }

  createCodex(data) {
    const entry = {
      _id: 'codex_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      novelId: data.novelId,
      category: data.category || 'Characters',
      name: data.name || 'Untitled Entry',
      summary: data.summary || '',
      description: data.description || '',
      tags: data.tags || [],
      traits: data.traits || {
        appearance: '',
        voice: '',
        quirks: '',
        background: '',
        significance: '',
      },
      timelineDate: data.timelineDate || '',
      color: data.color || '#8b5cf6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.codex.push(entry);
    return entry;
  }

  updateCodex(id, data) {
    const index = this.codex.findIndex((c) => c._id === id);
    if (index === -1) return null;
    this.codex[index] = {
      ...this.codex[index],
      ...data,
      traits: {
        ...this.codex[index].traits,
        ...(data.traits || {}),
      },
      updatedAt: new Date().toISOString(),
    };
    return this.codex[index];
  }

  deleteCodex(id) {
    const index = this.codex.findIndex((c) => c._id === id);
    if (index === -1) return false;
    this.codex.splice(index, 1);
    return true;
  }

  // --- EXPORT BUNDLING ---
  bundleManuscript(novelId, format = 'markdown') {
    const novel = this.getNovelById(novelId);
    if (!novel) return null;

    const chapters = this.getChapters(novelId);
    let output = '';

    if (format === 'markdown') {
      output += `# ${novel.title}\n`;
      if (novel.subtitle) output += `### ${novel.subtitle}\n`;
      output += `**By ${novel.author}**\n\n`;
      if (novel.synopsis) output += `> ${novel.synopsis}\n\n`;
      output += `---\n\n`;

      chapters.forEach((ch) => {
        output += `## ${ch.title}\n\n`;
        const scenes = this.getScenes(ch._id);
        scenes.forEach((sc, sIdx) => {
          if (sc.title && sc.title !== ch.title) {
            output += `### ${sc.title}\n\n`;
          }
          if (sc.metadata?.povCharacter) {
            output += `*[POV: ${sc.metadata.povCharacter}]*\n\n`;
          }
          output += `${sc.plainText || ''}\n\n`;
          if (sIdx < scenes.length - 1) {
            output += `* * *\n\n`;
          }
        });
        output += `\n`;
      });
    } else {
      // Plain text format
      output += `${novel.title.toUpperCase()}\n`;
      if (novel.subtitle) output += `${novel.subtitle}\n`;
      output += `By ${novel.author}\n\n`;
      output += `=========================================\n\n`;

      chapters.forEach((ch) => {
        output += `\n\n${ch.title.toUpperCase()}\n`;
        output += `-----------------------------------------\n\n`;
        const scenes = this.getScenes(ch._id);
        scenes.forEach((sc, sIdx) => {
          output += `${sc.plainText || ''}\n\n`;
          if (sIdx < scenes.length - 1) {
            output += `# # #\n\n`;
          }
        });
      });
    }

    return {
      title: novel.title,
      format,
      totalWordCount: novel.totalWordCount,
      content: output,
    };
  }
}

export const memoryStore = new MemoryStore();
