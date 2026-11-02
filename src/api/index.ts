import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import type { ApiResponse } from '../types/api';
import { codeToMessage } from '../errorCode';

const SUCCESS_CODE = [0];
const BUSINESS_ERROR = 'BUSINESS_ERROR';

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
	timeout: 10000
});

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('admin_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

const handleLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const errorHandle = (error: AxiosError<ApiResponse>) => {
  const code = error.response?.data?.code;
  const status = error.status;
  const targetCode = code ?? status ?? 500;
  const throwError = codeToMessage(error, targetCode);

  switch (targetCode) {
    case 401:
    case 403:
    case 1003:
      handleLogout();
      break;
  }

  if (!error.config?.silent) {
    ElMessage.error(throwError.message);
  }
  return Promise.reject(throwError);
};

instance.interceptors.response.use((response: AxiosResponse<ApiResponse<unknown>>) => {
	const { data } = response;
	if (SUCCESS_CODE.includes(data.code)) return response;
	return errorHandle(new AxiosError(data.message || '業務錯誤', BUSINESS_ERROR, response.config, response.request, response));
}, errorHandle);

const api = {
	async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const res = await instance.get<ApiResponse<T>>(url, config);
		return res.data.data;
	},
	async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		const res = await instance.post<ApiResponse<T>>(url, data, config);
		return res.data.data;
	},
	async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		const res = await instance.put<ApiResponse<T>>(url, data, config);
		return res.data.data;
	},
	async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		const res = await instance.patch<ApiResponse<T>>(url, data, config);
		return res.data.data;
	},
	async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const res = await instance.delete<ApiResponse<T>>(url, config);
		return res.data.data;
	}
};

export default api;
