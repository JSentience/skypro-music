// Сохранение токенов в localStorage
export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

// Получение токенов из localStorage
export const getTokens = () => {
  return {
    access: localStorage.getItem('accessToken'),
    refresh: localStorage.getItem('refreshToken'),
  };
};

// Удаление токенов из localStorage
export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Сохранение пользователя
export const saveUser = (user: {
  _id: number;
  username?: string;
  email: string;
}) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Получение пользователя
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Удаление пользователя
export const removeUser = () => {
  localStorage.removeItem('user');
};
