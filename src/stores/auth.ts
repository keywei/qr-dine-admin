import { defineStore } from 'pinia';
import api from '../api';
import type { AdminUser, LoginForm, LoginResult } from '../types/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    user: (localStorage.getItem('admin_user')
      ? JSON.parse(localStorage.getItem('admin_user')!)
      : null) as AdminUser | null,
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
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    },
    logout(): void {
      this.token = '';
      this.user = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    },
  },
});
