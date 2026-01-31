'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteTracks } from '@/hooks/useFavoriteTracks';
import { useAppSelector } from '@/store/store';

export const FavoriteClient = () => {
  useAuth();
  useFavoriteTracks();
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);
  return <Centerblock tracks={favoriteTracks} title="Избранное" />;
};
