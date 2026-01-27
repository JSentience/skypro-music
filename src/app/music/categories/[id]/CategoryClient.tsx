'use client';

import PlaylistDisplay from '@/components/PlaylistDisplay/PlaylistDisplay';
import { useAuth } from '@/hooks/useAuth';
import { getSelectionById, getTracks } from '@/sevices/tracks/tracksApi';
import { SelectionType, TrackType } from '@/sharedTypes/sharedTypes';
import { setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch } from '@/store/store';
import { useEffect, useRef, useState } from 'react';

type CategoryClientProps = {
  selectionId: string;
};

export default function CategoryClient({ selectionId }: CategoryClientProps) {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<TrackType[]>([]);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || hasFetchedRef.current) return;

    const parsedId = parseInt(selectionId, 10);
    if (Number.isNaN(parsedId)) return;

    hasFetchedRef.current = true;
    Promise.all([getSelectionById(parsedId), getTracks()])
      .then(([selectionData, tracks]) => {
        setSelection(selectionData);
        const selectedTracks = tracks.filter((track) =>
          selectionData.items.includes(track._id),
        );
        setFilteredTracks(selectedTracks);
        dispatch(setPlaylist(selectedTracks));
      })
      .catch(() => {
        dispatch(setPlaylist([]));
        setSelection(null);
        setFilteredTracks([]);
        hasFetchedRef.current = false;
      });
  }, [isAuthenticated, selectionId, dispatch]);

  return (
    <PlaylistDisplay tracks={filteredTracks} title={selection?.name || ''} />
  );
}
