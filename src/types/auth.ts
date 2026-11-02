export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AdminUser;
}
