'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setPlaylist } from '@/store/features/trackSlice';
import { SelectionType, TrackType } from '@/sharedTypes/sharedTypes';
import { useAuth } from '@/hooks/useAuth';
import PlaylistDisplay from '@/components/PlaylistDisplay/PlaylistDisplay';

type CategoryClientProps = {
  selection: SelectionType;
  tracks: TrackType[];
};

export default function CategoryClient({
  selection,
  tracks,
}: CategoryClientProps) {
  useAuth();
  const lastDispatchedTracksRef = useRef<TrackType[]>([]);
  const playlist = useAppSelector((state) => state.tracks.playlist || []);
  const dispatch = useAppDispatch();

  const filteredTracks = useMemo(() => {
    if (selection && playlist.length > 0 && selection.items) {
      return playlist.filter((track) => selection.items.includes(track._id));
    }
    return [];
  }, [selection, playlist]);

  useEffect(() => {
    if (playlist.length === 0) {
      dispatch(setPlaylist(tracks));
    }
  }, [tracks, dispatch, playlist.length]);

  useEffect(() => {
    if (
      filteredTracks.length > 0 &&
      (lastDispatchedTracksRef.current.length !== filteredTracks.length ||
        lastDispatchedTracksRef.current[0]?._id !== filteredTracks[0]?._id)
    ) {
      dispatch(setPlaylist(filteredTracks));
      lastDispatchedTracksRef.current = filteredTracks;
    }
  }, [filteredTracks, dispatch]);

  return (
    <PlaylistDisplay tracks={filteredTracks} title={selection?.name || ''} />
  );
}
