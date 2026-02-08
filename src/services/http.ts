import { BASE_URL } from '@/services/constants';
import { setLogout, setToken } from '@/store/features/authSlice';
import type { AppStore } from '@/store/store';
import { clearAuthData, saveTokens } from '@/utils/authTokens';
import { notify } from '@/utils/notify';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

let store: AppStore | null = null;

export const initializeHttpStore = (appStore: AppStore) => {
  store = appStore;
};

const CONTENT_TYPE_HEADER = 'content-type';
const AUTH_HEADER = 'Authorization';
const CONTENT_TYPE_JSON = 'application/json';

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const notifySubscribers = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const subscribeToRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const getAccessToken = () => store?.getState().auth.accessToken;
const getRefreshToken = () => store?.getState().auth.refreshToken;

const setAuthHeader = (
  config: InternalAxiosRequestConfig,
  token?: string | null,
) => {
  if (token) {
    config.headers[AUTH_HEADER] = `Bearer ${token}`;
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post(
    `${BASE_URL}/user/token/refresh/`,
    { refresh: refreshToken },
    {
      headers: {
        [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
      },
    },
  );

  const { access, refresh } = response.data;
  return { access, refresh };
};

const applyNewTokens = (access: string, refresh: string) => {
  store?.dispatch(setToken({ access, refresh }));
  saveTokens(access, refresh);
};

const logoutWithRedirect = () => {
  if (store) {
    store.dispatch(setLogout());
  }
  clearAuthData();

  if (typeof window !== 'undefined') {
    window.location.href = '/auth/signin';
  }
};

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    setAuthHeader(config, accessToken);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeToRefresh((token: string) => {
            setAuthHeader(originalRequest, token);
            resolve(http(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (!store) throw new Error('Store not initialized');

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { access, refresh } = await refreshAccessToken(refreshToken);
        const nextRefreshToken = refresh || refreshToken;

        applyNewTokens(access, nextRefreshToken);

        setAuthHeader(originalRequest, access);

        isRefreshing = false;
        notifySubscribers(access);

        return http(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];

        notify.warning('Сессия истекла. Войдите снова');
        logoutWithRedirect();

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status && error.response.status >= 500) {
      notify.error('Ошибка сервера. Попробуйте позже');
    }

    return Promise.reject(error);
  },
);
