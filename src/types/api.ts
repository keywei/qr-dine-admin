import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    silent?: boolean;
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message?: string;
  data: T;
}
