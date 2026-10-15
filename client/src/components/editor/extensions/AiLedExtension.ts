import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';

export const aiLedPluginKey = new PluginKey('aiLedExtension');

function buildLedDecorations(doc: any): DecorationSet {
  const decorations: Decoration[] = [];
  const state = useWorkspaceStore.getState();
  const isReaderMode = state.isReaderMode;
  const activePassage = state.activePassage;
  const activeCommentLine = state.activeCommentLine;
  const activeNovelId = state.activeNovelId || '';
  const activeChapterId = state.activeChapterId || '';
  const lineComments = state.lineComments || [];

  doc.descendants((node: any, pos: number) => {
    // Target each line (textblock node: paragraph or heading)
    if (node.isTextblock) {
      const lineRaw = node.textContent;
      if (!lineRaw || !lineRaw.trim()) return;

      const lineFrom = pos + 1; // start of line content
      const lineTo = pos + 1 + node.content.size; // end of line content
      const lineText = lineRaw.trim();

      // Position widget immediately at the end of the line
      const widgetPos = lineTo;

      // Count reader comments associated with this line
      const lineCommentsCount = lineComments.filter(
        (c) =>
          (c.novelId === activeNovelId || !c.novelId) &&
          (c.lineText.trim() === lineText || (c.lineFrom === lineFrom && c.lineTo === lineTo))
      ).length;

      if (isReaderMode) {
        // ===================================================================
        // INVITED READER MODE: Orange dot allows writing/viewing comments
        // ===================================================================
        const isActive =
          activeCommentLine?.lineText === lineText ||
          (activeCommentLine?.lineFrom === lineFrom && activeCommentLine?.lineTo === lineTo);

        const deco = Decoration.widget(
          widgetPos,
          () => {
            const container = document.createElement('span');
            container.className =
              'ai-led-wrapper inline-flex items-center align-middle select-none';
            container.contentEditable = 'false';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = `reader-orange-led group relative inline-flex items-center justify-center p-0.5 focus:outline-none cursor-pointer ${
              isActive ? 'is-active' : ''
            } ${lineCommentsCount > 0 ? 'has-comments' : ''}`;
            button.setAttribute('aria-label', 'Write comment on this line');
            button.setAttribute(
              'title',
              lineCommentsCount > 0
                ? `${lineCommentsCount} reader comment${lineCommentsCount > 1 ? 's' : ''} on this line - Click to view or add feedback`
                : 'Click orange circle to write a comment on this line'
            );

            const bulb = document.createElement('span');
            bulb.className = 'reader-led-bulb';
            button.appendChild(bulb);

            const handleTrigger = (e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();

              useWorkspaceStore.getState().openLineComments({
                novelId: activeNovelId,
                chapterId: activeChapterId,
                lineFrom,
                lineTo,
                lineText,
              });
            };

            button.addEventListener('mousedown', (e) => {
              e.preventDefault();
              e.stopPropagation();
            });
            button.addEventListener('click', handleTrigger);

            container.appendChild(button);
            return container;
          },
          {
            side: 1,
            key: `reader-led-${lineFrom}-${lineTo}`,
            stopEvent: () => true,
            ignoreSelection: true,
          }
        );

        decorations.push(deco);
      } else {
        // ===================================================================
        // AUTHOR MODE: Blue LED dot opens AI Copilot inspection
        // If line has reader comments, also show an orange comment bubble!
        // ===================================================================
        const isActive =
          activePassage?.from === lineFrom && activePassage?.to === lineTo;

        const deco = Decoration.widget(
          widgetPos,
          () => {
            const container = document.createElement('span');
            container.className =
              'ai-led-wrapper inline-flex items-center align-middle select-none gap-1';
            container.contentEditable = 'false';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = `ai-blue-led group relative inline-flex items-center justify-center p-0.5 focus:outline-none cursor-pointer ${
              isActive ? 'is-active' : ''
            }`;
            button.setAttribute('aria-label', 'Inspect line with AI Narrative Copilot');
            button.setAttribute('title', 'Click blue circle to inspect this line with AI Copilot');

            const bulb = document.createElement('span');
            bulb.className = 'ai-led-bulb';
            button.appendChild(bulb);

            const handleTrigger = (e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();

              useWorkspaceStore.getState().openAiAssistant({
                text: lineText,
                from: lineFrom,
                to: lineTo,
                type: 'paragraph',
              });
            };

            button.addEventListener('mousedown', (e) => {
              e.preventDefault();
              e.stopPropagation();
            });
            button.addEventListener('click', handleTrigger);
            container.appendChild(button);

            // If readers left feedback on this line, render orange comment indicator for author
            if (lineCommentsCount > 0) {
              const commentButton = document.createElement('button');
              commentButton.type = 'button';
              commentButton.className =
                'reader-orange-led has-comments cursor-pointer p-0.5 ml-0.5';
              commentButton.setAttribute(
                'title',
                `${lineCommentsCount} reader comment${lineCommentsCount > 1 ? 's' : ''} on this line - Click to review reader feedback`
              );
              const commentBulb = document.createElement('span');
              commentBulb.className = 'reader-led-bulb';
              commentButton.appendChild(commentBulb);

              commentButton.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
              });
              commentButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                useWorkspaceStore.getState().openLineComments({
                  novelId: activeNovelId,
                  chapterId: activeChapterId,
                  lineFrom,
                  lineTo,
                  lineText,
                });
              });
              container.appendChild(commentButton);
            }

            return container;
          },
          {
            side: 1,
            key: `author-led-${lineFrom}-${lineTo}`,
            stopEvent: () => true,
            ignoreSelection: true,
          }
        );

        decorations.push(deco);
      }
    }
  });

  decorations.sort((a, b) => a.from - b.from);
  return DecorationSet.create(doc, decorations);
}

export const AiLedExtension = Extension.create({
  name: 'aiLedExtension',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: aiLedPluginKey,
        state: {
          init(_, { doc }) {
            return buildLedDecorations(doc);
          },
          apply(tr, oldSet, _oldState, newState) {
            if (tr.docChanged || tr.getMeta('forceUpdateAiLeds')) {
              return buildLedDecorations(newState.doc);
            }
            return oldSet.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
