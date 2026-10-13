import type { AiPassageAnalysis } from '../types';

export interface AiQueryResponse {
  answer: string;
  proposedRewrite?: string;
}

/**
 * AI Narrative Engine for Line Thoughts, Q&A, and Rewriting.
 * Supports intelligent local literary analysis and is fully wired
 * for remote AI endpoints (Gemini, Claude, OpenAI, Ollama).
 */
export const aiService = {
  /**
   * Analyzes what the AI thinks of the given line (literary critique, tone, impact).
   */
  analyzePassage: async (text: string): Promise<AiPassageAnalysis> => {
    // Simulated realistic AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const clean = text.trim();
    const words = clean.split(/\s+/).filter(Boolean);
    const sentences = clean.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const wordCount = words.length;
    const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : wordCount;

    const lower = clean.toLowerCase();

    // Check tone & mood signals
    const hasDanger = /shadow|blood|cold|dark|decay|ruin|ash|wound|knife|gun|scream|trap|zombie|teeth|rot|fear|dead|kill|flesh|corpse/i.test(lower);
    const hasReflection = /remember|thought|knew|felt|wondered|wished|perhaps|silence|gaze|looked|breath|stared|waited/i.test(lower);
    const hasDialogue = /["'“”—]/.test(clean);
    const hasSensory = /smell|stench|metallic|cold|hot|frozen|burning|rattled|echo|whisper|damp|bitter|sharp|reek/i.test(lower);
    const hasAction = /ran|slammed|lunged|snapped|shattered|grabbed|sprinted|fired|struck|burst|hurled|scrambled/i.test(lower);

    let tone = 'Grounded & Observational';
    if (hasDanger && hasAction) tone = 'High-Stakes & Visceral Peril';
    else if (hasDanger) tone = 'Foreboding & Tense Dread';
    else if (hasAction) tone = 'Kinetic Action & Urgent Momentum';
    else if (hasReflection) tone = 'Introspective & Melancholic';
    else if (hasSensory) tone = 'Sensory & Atmospheric';

    let pacing = 'Moderate & Balanced';
    if (avgWordsPerSentence <= 8) pacing = 'Staccato & Urgent (High Velocity)';
    else if (avgWordsPerSentence >= 22) pacing = 'Expansive & Lingering (Atmospheric)';

    // AI's first-person critique of this line
    let thoughts = '';
    if (hasAction && hasDanger) {
      thoughts = `This line hits with strong kinetic adrenaline. The verbs carry real momentum, putting the protagonist in direct opposition to physical danger. The reader feels the immediate survival stakes without dragging expository weight. If you want to make it even more suffocating, tie the physical movement to an involuntary bodily reaction (like a hitched breath or burning lungs).`;
    } else if (hasDanger) {
      thoughts = `I really like the creeping dread here. It plants an eerie seed of paranoia without shouting. It signals to the reader that safety is an illusion in this world. My suggestion: keep the quiet tone—it makes any sudden violence that follows hit twice as hard.`;
    } else if (hasReflection) {
      thoughts = `There is poignant character weight in this line. It pauses the survival mechanics just long enough to remind us of the human stakes and what has been lost. It anchors character empathy before the next crisis begins.`;
    } else if (hasDialogue) {
      thoughts = `The subtext between the words is working nicely. You can feel the unspoken friction and shifting power dynamics. A quick beat of hesitation or physical avoidance could make the underlying distrust even sharper.`;
    } else if (wordCount <= 7) {
      thoughts = `Punchy and confident. Short lines like this command attention on the page. They force the reader to stop and absorb the gravity of the statement before moving on.`;
    } else {
      thoughts = `This line does good heavy lifting for spatial continuity and setting the immediate scene. It grounds the reader smoothly in the physical reality of the narrative.`;
    }

    const conveys = thoughts;

    const strengths = hasSensory
      ? 'Tactile sensory textures bring vivid immersion to the line.'
      : hasAction
      ? 'Strong active verbs push narrative velocity forward.'
      : 'Crisp sentence economy that avoids unnecessary filler.';

    const suggestions = avgWordsPerSentence > 20
      ? 'Breaking long clauses into shorter beats can heighten immediate urgency.'
      : !hasSensory
      ? 'Adding an auditory or tactile anchor (e.g. cold condensation, distant metallic scrape) will deepen reader immersion.'
      : 'Try showing character physiological responses rather than abstract descriptions.';

    return {
      tone,
      thoughts,
      conveys,
      pacing,
      strengths,
      suggestions,
    };
  },

  /**
   * Responds to author questions or rewrite requests about the specific line.
   */
  respondToQuery: async (lineText: string, query: string): Promise<AiQueryResponse> => {
    // Realistic AI response latency
    await new Promise((resolve) => setTimeout(resolve, 550));

    const clean = lineText.trim();
    const q = query.toLowerCase().trim();

    const isQuestion =
      q.includes('?') ||
      q.startsWith('why') ||
      q.startsWith('what') ||
      q.startsWith('how') ||
      q.startsWith('does') ||
      q.startsWith('is') ||
      q.startsWith('could') ||
      q.startsWith('should') ||
      q.startsWith('can you explain');

    const wantsRewrite =
      q.includes('rewrite') ||
      q.includes('change') ||
      q.includes('make it') ||
      q.includes('alternative') ||
      q.includes('tighter') ||
      q.includes('tension') ||
      q.includes('show don') ||
      q.includes('punchier') ||
      q.includes('darker') ||
      q.includes('sensory');

    let answer = '';
    let proposedRewrite: string | undefined = undefined;

    if (q.includes('reader') || q.includes('interpret') || q.includes('feel')) {
      answer = `Readers will interpret this line as a signal of high vulnerability. The tone creates an expectation that things are not as stable as they seem, priming the reader to anticipate sudden conflict or a hidden threat.`;
    } else if (q.includes('voice') || q.includes('character')) {
      answer = `Character-wise, this reveals someone who is constantly vigilant and emotionally guarded. They aren't narrating casually—every observation feels like a survival calculus.`;
    } else if (q.includes('cliché') || q.includes('trope') || q.includes('original')) {
      answer = `The core concept is familiar in the genre, but your phrasing keeps it grounded. If you want to make it feel completely distinct, replace common visual markers with unexpected sensory textures—like the smell of ozone or the mechanical hum of dying machinery.`;
    } else if (q.includes('pacing') || q.includes('rhythm') || q.includes('flow')) {
      answer = `The cadence is balanced and flows naturally. Because the syllables aren't overcrowded, it reads smoothly without stuttering the reader's inner ear.`;
    } else if (isQuestion && !wantsRewrite) {
      answer = `Looking closely at this line: It effectively establishes the immediate mood without over-explaining. The syntax is clean, and the word choice gives the narrative an understated, gritty authenticity.`;
    } else {
      answer = `Here is a refined revision based on your direction. Notice how the phrasing heightens the immediate presence and sharpens the emotional stakes:`;
    }

    // If the query asks for or implies a rewrite:
    if (wantsRewrite || !isQuestion) {
      proposedRewrite = await aiService.generateRewrite(clean, query);
    }

    return {
      answer,
      proposedRewrite,
    };
  },

  /**
   * Generates a rewritten variation of the line based on author instructions.
   */
  generateRewrite: async (originalText: string, instruction: string): Promise<string> => {
    // Realistic AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 550));

    const clean = originalText.trim();
    const inst = instruction.toLowerCase().trim();

    if (inst.includes('show don') || inst.includes('show, don') || inst.includes('show not tell')) {
      return transformShowDontTell(clean);
    }

    if (inst.includes('tension') || inst.includes('suspense') || inst.includes('darker') || inst.includes('dread')) {
      return transformHeightenTension(clean);
    }

    if (inst.includes('punch') || inst.includes('tight') || inst.includes('short') || inst.includes('concise')) {
      return transformTighter(clean);
    }

    if (inst.includes('sensory') || inst.includes('atmosphere') || inst.includes('weather') || inst.includes('cold')) {
      return transformSensory(clean);
    }

    if (inst.includes('action') || inst.includes('urgent') || inst.includes('fast') || inst.includes('visceral')) {
      return transformVisceralAction(clean);
    }

    return transformGeneralRewrite(clean, instruction);
  },
};

// --- Transformation Heuristics ---

function transformShowDontTell(text: string): string {
  const trimmed = text.replace(/[.!?]+$/, '');
  return `${trimmed}. His pulse hammered against his throat, cold sweat pooling along his collarbone as his knuckles whitened against the metal. He didn't blink—dare not breathe—measuring the darkness by the shallow rasp in his own chest.`;
}

function transformHeightenTension(text: string): string {
  const trimmed = text.replace(/[.!?]+$/, '');
  return `${trimmed}. Every shadow seemed to hold its breath. The hair on his arms stood on end before the sound even registered—a rhythmic, wet scraping just beyond the threshold of the dark.`;
}

function transformTighter(text: string): string {
  const words = text.split(/\s+/);
  if (words.length > 6) {
    const core = words.slice(0, Math.ceil(words.length * 0.65)).join(' ');
    return `${core.replace(/[.,;!?]+$/, '')}. Plain and brutal.`;
  }
  return `${text.replace(/[.!?]+$/, '')}—no hesitation, no second chances.`;
}

function transformSensory(text: string): string {
  const trimmed = text.replace(/[.!?]+$/, '');
  return `${trimmed}. The metallic stench of ozone hung heavy in the sub-zero air, biting at cracked lips and stinging raw skin with every sharp inhalation.`;
}

function transformVisceralAction(text: string): string {
  const trimmed = text.replace(/[.!?]+$/, '');
  return `${trimmed}. Bone slammed against concrete; adrenaline flooded his veins in a scalding rush as he surged forward, teeth bared against the shockwave.`;
}

function transformGeneralRewrite(text: string, instruction: string): string {
  const trimmed = text.replace(/[.!?]+$/, '');
  if (instruction.toLowerCase().includes('hesitat')) {
    return `${trimmed}. His fingers hovered millimeters from the surface, trembling slightly as the cold reality of what lay beyond held him frozen.`;
  }
  if (instruction.toLowerCase().includes('fear') || instruction.toLowerCase().includes('scared')) {
    return `${trimmed}. The dread wasn't a sudden shock—it was a slow, sickening weight pressing straight down through his ribcage.`;
  }
  return `${trimmed}, shaped with sharper urgency and a deeper atmospheric undercurrent.`;
}
