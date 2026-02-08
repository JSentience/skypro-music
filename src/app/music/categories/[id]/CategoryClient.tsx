'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { getSelectionById, getTracks } from '@/services/tracks/tracksApi';
import { SelectionType, TrackType } from '@/sharedTypes/sharedTypes';
import { setLoading, setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch } from '@/store/store';
import { notify } from '@/utils/notify';
import { useEffect, useRef, useState } from 'react';

type CategoryClientProps = {
  selectionId: string;
};

export default function CategoryClient({ selectionId }: CategoryClientProps) {
  const dispatch = useAppDispatch();
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<TrackType[]>([]);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    const parsedId = parseInt(selectionId, 10);
    if (Number.isNaN(parsedId)) return;

    hasFetchedRef.current = true;
    dispatch(setLoading(true));
    Promise.all([getSelectionById(parsedId), getTracks()])
      .then(([selectionData, tracks]) => {
        setSelection(selectionData);
        const selectedTracks = tracks.filter((track) =>
          selectionData.items.includes(track._id),
        );
        setFilteredTracks(selectedTracks);
        dispatch(setPlaylist(selectedTracks));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error('Ошибка загрузки подборки', error);
        notify.error('Не удалось загрузить подборку');
        dispatch(setPlaylist([]));
        setSelection(null);
        setFilteredTracks([]);
        dispatch(setLoading(false));
        hasFetchedRef.current = false;
      });
  }, [selectionId, dispatch]);

  return <Centerblock tracks={filteredTracks} title={selection?.name || ''} />;
}
