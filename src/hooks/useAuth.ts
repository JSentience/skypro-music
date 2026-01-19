'use client';

import { setToken, setUser } from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getTokens, getUser } from '@/utils/authTokens';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = (requireAuth = true) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, refreshToken } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    const tokens = getTokens();
    const user = getUser();

    if (tokens.access && tokens.refresh && user) {
      dispatch(setUser(user));
      dispatch(setToken({ access: tokens.access, refresh: tokens.refresh }));
    } else if (requireAuth) {
      router.replace('/auth/signin');
    }
  }, [dispatch, router, requireAuth]);

  return { isAuthenticated, accessToken, refreshToken };
};
