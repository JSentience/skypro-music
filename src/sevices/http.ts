import { BASE_URL } from '@/sevices/constants';
import { setLogout, setToken } from '@/store/features/authSlice';
import type { AppStore } from '@/store/store';
import { removeTokens, removeUser, saveTokens } from '@/utils/authTokens';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Будет заполнено при инициализации
let store: AppStore | null = null;

export const initializeHttpStore = (appStore: AppStore) => {
  store = appStore;
};

const CONTENT_TYPE_HEADER = 'content-type';
const AUTH_HEADER = 'Authorization';
const CONTENT_TYPE_JSON = 'application/json';

// Создаём axios-инстанс
export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
  },
});

// Флаг, чтобы избежать множественных рефреш-запросов (гоночные условия)
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
  removeTokens();
  removeUser();

  if (typeof window !== 'undefined') {
    window.location.href = '/auth/signin';
  }
};

// Request-интерцептор: добавляем access-токен
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

// Response-интерцептор: обработка 401 и рефреш токена
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Если это ошибка 401 и запрос ещё не был повторён
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если рефреш уже идёт, ждём завершения и повторяем запрос
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

        // Вызываем API для обновления токена
        const { access, refresh } = await refreshAccessToken(refreshToken);
        const nextRefreshToken = refresh || refreshToken;

        // Сохраняем новые токены в Redux и localStorage
        applyNewTokens(access, nextRefreshToken);

        // Обновляем заголовок в оригинальном запросе
        setAuthHeader(originalRequest, access);

        // Оповещаем ждущие запросы о новом токене
        isRefreshing = false;
        notifySubscribers(access);

        // Повторяем оригинальный запрос
        return http(originalRequest);
      } catch (refreshError) {
        // Если рефреш не удался, логиним пользователя
        isRefreshing = false;
        refreshSubscribers = [];

        // Редирект на логин (вызовется при следующем рендере)
        logoutWithRedirect();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
