import { defineStore } from 'pinia';
import api from '../api';
import type { AdminUser, LoginForm, LoginResult } from '../types/auth';
import { getToken, getUser, setToken, setUser, handleLogout } from '../utils/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken(),
    user: getUser<AdminUser>(),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(form: LoginForm): Promise<boolean> {
      const data = await api.post<LoginResult>('/auth/login', form);
      if (data?.token) {
        this.token = data.token;
        this.user = data.user;
        setToken(data.token);
        setUser(data.user);
        return true;
      }
      return false;
    },
    logout(): void {
      this.token = '';
      this.user = null;
      handleLogout();
    },
  },
});
