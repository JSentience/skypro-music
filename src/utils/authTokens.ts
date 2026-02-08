export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const getTokens = () => {
  return {
    access: localStorage.getItem('accessToken'),
    refresh: localStorage.getItem('refreshToken'),
  };
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const saveUser = (user: {
  _id: number;
  username?: string;
  email: string;
}) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const clearAuthData = () => {
  removeTokens();
  removeUser();
};
