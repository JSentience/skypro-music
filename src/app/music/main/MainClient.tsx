'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { getTracks } from '@/sevices/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { setLoading, setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useRef } from 'react';

export default function MainClient() {
  const dispatch = useAppDispatch();
  const playlist = useAppSelector((state) => state.tracks.playlist || []);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    dispatch(setLoading(true));
    getTracks()
      .then((tracks: TrackType[]) => {
        dispatch(setPlaylist(tracks));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error('Ошибка загрузки треков', error);
        dispatch(setLoading(false));
        hasFetchedRef.current = false;
      });
  }, [dispatch]);

  return <Centerblock tracks={playlist} title="Треки" />;
}
