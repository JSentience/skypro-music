'use client';

import PlaylistDisplay from '@/components/PlaylistDisplay/PlaylistDisplay';
import { useFavoriteTracks } from '@/hooks/useFavoriteTracks';
import { useAppSelector } from '@/store/store';

export const FavoriteClient = () => {
  useFavoriteTracks();
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);
  return <PlaylistDisplay tracks={favoriteTracks} title="Избранное" />;
};
