'use client';

import PlaylistDisplay from '@/components/PlaylistDisplay/PlaylistDisplay';
import { useAuth } from '@/hooks/useAuth';
import { getSelectionById } from '@/sevices/tracks/selectionsApi';
import { getTracks } from '@/sevices/tracks/tracksApi';
import { SelectionType, TrackType } from '@/sharedTypes/sharedTypes';
import { setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch } from '@/store/store';
import { useEffect, useState } from 'react';

type CategoryClientProps = {
  selectionId: string;
};

export default function CategoryClient({ selectionId }: CategoryClientProps) {
  const { isAuthenticated, accessToken } = useAuth();
  const dispatch = useAppDispatch();
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<TrackType[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const parsedId = parseInt(selectionId, 10);
    if (Number.isNaN(parsedId)) return;

    Promise.all([
      getSelectionById(parsedId, accessToken),
      getTracks(accessToken),
    ])
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
      });
  }, [isAuthenticated, accessToken, selectionId, dispatch]);

  return (
    <PlaylistDisplay tracks={filteredTracks} title={selection?.name || ''} />
  );
}
