'use client';

import { setLogout } from '@/store/features/authSlice';
import { useAppDispatch } from '@/store/store';
import { clearAuthData } from '@/utils/authTokens';
import { notify } from '@/utils/notify';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type UseLogoutOptions = {
  redirectTo?: string;
  message?: string;
  delayMs?: number;
};

export const useLogout = (options: UseLogoutOptions = {}) => {
  const {
    redirectTo = '/auth/signin',
    message = 'Вы вышли из аккаунта',
    delayMs = 300,
  } = options;
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useCallback(() => {
    dispatch(setLogout());
    clearAuthData();
    notify.info(message);
    setTimeout(() => router.push(redirectTo), delayMs);
  }, [dispatch, delayMs, message, redirectTo, router]);
};
