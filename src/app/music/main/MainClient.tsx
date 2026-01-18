'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setPlaylist } from '@/store/features/trackSlice';
import { TrackType } from '@/sharedTypes/sharedTypes';
import PlaylistDisplay from '@/components/PlaylistDisplay/PlaylistDisplay';
import { useAuth } from '@/hooks/useAuth';

interface MainClientProps {
  tracks: TrackType[];
}

export default function MainClient({ tracks }: MainClientProps) {
  useAuth();
  const dispatch = useAppDispatch();
  const playlist = useAppSelector((state) => state.tracks.playlist || []);

  useEffect(() => {
    if (playlist.length === 0) {
      dispatch(setPlaylist(tracks));
    }
  }, [tracks, dispatch, playlist.length]);

  return <PlaylistDisplay tracks={playlist} title="Треки" />;
}
