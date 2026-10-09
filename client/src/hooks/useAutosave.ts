import { useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { api } from '../services/api';
import type { SceneStatus } from '../types';

export function useAutosave(
  sceneId: string | null,
  payload: {
    contentJson: any;
    plainText: string;
    wordCount: number;
    characterCount?: number;
    metadata?: any;
    status?: SceneStatus;
  } | null
) {
  const setSaveStatus = useWorkspaceStore((s) => s.setSaveStatus);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPayloadRef = useRef(payload);
  latestPayloadRef.current = payload;

  useEffect(() => {
    if (!sceneId || !payload) return;

    // Indicate that there are pending changes being prepared
    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce Tier 2: 1-second debounced PATCH request to MongoDB
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const toSave = latestPayloadRef.current;
        if (!toSave) return;

        await api.patchScene(sceneId, {
          contentJson: toSave.contentJson,
          plainText: toSave.plainText,
          wordCount: toSave.wordCount,
          characterCount: toSave.characterCount,
          metadata: toSave.metadata,
          status: toSave.status,
        });

        setSaveStatus('saved');
        useWorkspaceStore.setState({ lastSavedAt: new Date() });
      } catch (err) {
        console.warn('Tier 2 cloud sync failed, stored in Tier 1 localStorage:', err);
        setSaveStatus('cached-offline');
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    sceneId,
    payload?.plainText,
    payload?.wordCount,
    payload?.status,
    payload?.metadata?.povCharacter,
    payload?.metadata?.inUniverseDate,
    payload?.metadata?.objective,
    payload?.metadata?.notes,
    setSaveStatus,
  ]);
}
