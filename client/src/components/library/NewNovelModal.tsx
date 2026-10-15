import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Novel } from '../../types';

interface NewNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNovel?: Novel | null;
}

/**
 * @deprecated Use dedicated page `/stories/new` or `/stories/:id/edit` (CreateStoryView) instead of a modal.
 */
export const NewNovelModal: React.FC<NewNovelModalProps> = ({ isOpen, onClose, editingNovel }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      onClose();
      if (editingNovel?._id) {
        navigate(`/stories/${editingNovel._id}/edit`);
      } else {
        navigate('/stories/new');
      }
    }
  }, [isOpen, onClose, editingNovel, navigate]);

  return null;
};
