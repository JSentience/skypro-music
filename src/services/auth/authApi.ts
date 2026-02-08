import { BASE_URL } from '@/services/constants';
import axios, { AxiosError } from 'axios';

type AuthCredentials = {
  email: string;
  password: string;
};

type AuthUser = {
  email: string;
  username: string;
  _id: number;
};

type RegistrationPayload = {
  email: string;
  username: string;
  password: string;
};

type RegistrationResult = {
  message: string;
  result: AuthUser;
  success: boolean;
};

type AuthTokens = {
  access: string;
  refresh: string;
};

type ErrorResponse = {
  message?: string;
};

const authHttp = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
});

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return axiosError.response?.data?.message || fallback;
  }
  return fallback;
};

const postJson = async <T>(
  url: string,
  data: AuthCredentials | RegistrationPayload,
) => {
  const response = await authHttp.post<T>(url, data);
  return response.data;
};

export const authUser = async (data: AuthCredentials): Promise<AuthUser> => {
  try {
    return await postJson<AuthUser>('/user/login/', data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Ошибка входа'));
  }
};

export const registrationUser = async (
  data: RegistrationPayload,
): Promise<RegistrationResult> => {
  try {
    return await postJson<RegistrationResult>('/user/signup/', data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Ошибка регистрации'));
  }
};

export const getToken = async (data: AuthCredentials): Promise<AuthTokens> => {
  try {
    return await postJson<AuthTokens>('/user/token/', data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Ошибка получения токенов'));
  }
};
