'use client';

import { useAuth } from '@/hooks/useAuth';
import { getFavoriteTracks } from '@/services/tracks/tracksApi';
import { setFavoritesTracks, setLoading } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { notify } from '@/utils/notify';
import { useEffect, useRef } from 'react';

export const useFavoriteTracks = () => {
  const { isAuthenticated } = useAuth(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    dispatch(setLoading(true));

    getFavoriteTracks()
      .then((tracks) => {
        dispatch(setFavoritesTracks(tracks));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error('Ошибка загрузки избранных треков', error);
        notify.error('Не удалось загрузить избранные треки');
        dispatch(setLoading(false));
        hasFetchedRef.current = false;
      });
  }, [isAuthenticated, accessToken, dispatch]);
};
