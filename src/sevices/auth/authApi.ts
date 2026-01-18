import { BASE_URL } from '@/sevices/constants';
import axios from 'axios';

type AuthUserProps = {
  email: string;
  password: string;
};
type AuthUserResponse = {
  email: string;
  password: string;
  _id: number;
};
type RegistrationUserProps = {
  email: string;
  username: string;
  password: string;
};
type RegistrationUserResponse = {
  message: string;
  result: AuthUserResponse;
  success: boolean;
};

type TokenResponse = {
  access: string;
  refresh: string;
};

export const authUser = async (
  data: AuthUserProps,
): Promise<AuthUserResponse> => {
  try {
    const response = await axios.post(BASE_URL + '/user/login/', data, {
      headers: {
        // API требует обязательного указания заголовка content-type, так апи понимает что мы посылаем ему json строчку в теле запроса
        'content-type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Ошибка входа');
    }
    throw new Error('Ошибка входа');
  }
};

export const registrationUser = async (
  data: RegistrationUserProps,
): Promise<RegistrationUserResponse> => {
  try {
    const response = await axios.post(BASE_URL + '/user/signup/', data, {
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Ошибка регистрации');
    }
    throw new Error('Ошибка регистрации');
  }
};

export const getToken = async (data: AuthUserProps): Promise<TokenResponse> => {
  try {
    const response = await axios.post(BASE_URL + '/user/token/', data, {
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Ошибка получения токенов',
      );
    }
    throw new Error('Ошибка получения токена');
  }
};
