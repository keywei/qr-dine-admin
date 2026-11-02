const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export const getToken = (): string => localStorage.getItem(TOKEN_KEY) || '';

export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);

export const getUser = <T = unknown>(): T | null => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user) as T;
  } catch {
    return null;
  }
};

export const setUser = (user: unknown): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const handleLogout = (): void => {
  clearAuth();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};
