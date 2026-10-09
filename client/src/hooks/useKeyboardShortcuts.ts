import { useEffect } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export function useKeyboardShortcuts() {
  const toggleZenMode = useWorkspaceStore((s) => s.toggleZenMode);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const toggleCodex = useWorkspaceStore((s) => s.toggleCodex);
  const isZenMode = useWorkspaceStore((s) => s.panelState.isZenMode);
  const setZenMode = useWorkspaceStore((s) => s.setZenMode);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + \ -> Zen Focus Mode as specified
      if (isCmdOrCtrl && e.key === '\\') {
        e.preventDefault();
        toggleZenMode();
        return;
      }

      // Escape -> exit Zen mode if active
      if (e.key === 'Escape' && isZenMode) {
        e.preventDefault();
        setZenMode(false);
        return;
      }

      // Cmd/Ctrl + Shift + C -> Toggle Codex Lore Drawer
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        toggleCodex();
        return;
      }

      // Cmd/Ctrl + Shift + S -> Toggle Sidebar Manuscript Tree
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        toggleSidebar();
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleZenMode, toggleSidebar, toggleCodex, isZenMode, setZenMode]);
}
