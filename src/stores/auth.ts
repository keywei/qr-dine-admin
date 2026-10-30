import { defineStore } from 'pinia';
import api from '../api';

export interface AdminUserInfo {
  id: number;
  username: string;
  name: string;
  role: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    user: (localStorage.getItem('admin_user')
      ? JSON.parse(localStorage.getItem('admin_user')!)
      : null) as AdminUserInfo | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(form: { username: string; password: string }) {
      const res: any = await api.post('/auth/login', form);
      if (res.success && res.data) {
        this.token = res.data.token;
        this.user = res.data.user;
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        return true;
      }
      return false;
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    },
  },
});

