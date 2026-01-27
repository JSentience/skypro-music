'use client';

import PlaylistDisplay from '@/components/PlaylistDisplay/PlaylistDisplay';
import { useAuth } from '@/hooks/useAuth';
import { getTracks } from '@/sevices/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useRef } from 'react';

export default function MainClient() {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const playlist = useAppSelector((state) => state.tracks.playlist || []);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    getTracks()
      .then((tracks: TrackType[]) => {
        dispatch(setPlaylist(tracks));
      })
      .catch((error) => {
        console.error('Ошибка загрузки треков', error);
        hasFetchedRef.current = false;
      });
  }, [isAuthenticated, dispatch]);

  return <PlaylistDisplay tracks={playlist} title="Треки" />;
}
