import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';

export const aiLedPluginKey = new PluginKey('aiLedExtension');

function buildLedDecorations(doc: any): DecorationSet {
  const decorations: Decoration[] = [];
  const activePassage = useWorkspaceStore.getState().activePassage;

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

      const isActive =
        activePassage?.from === lineFrom && activePassage?.to === lineTo;

      const deco = Decoration.widget(
        widgetPos,
        () => {
          const container = document.createElement('span');
          container.className = 'ai-led-wrapper inline-flex items-center align-middle select-none';
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

            // Only clicking this blue LED will show the narrative copilot for this line
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
          return container;
        },
        {
          side: 1,
          key: `led-line-${lineFrom}-${lineTo}`,
          stopEvent: () => true,
          ignoreSelection: true,
        }
      );

      decorations.push(deco);
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
