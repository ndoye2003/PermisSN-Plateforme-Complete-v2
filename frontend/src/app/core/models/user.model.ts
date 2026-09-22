export type Role = 'admin' | 'agent' | 'candidat' | 'auto_ecole';

export interface User {
  id: number;
  name: string;
  identifiant: string;
  email: string;
  role: Role;
  is_active: boolean;
  candidat?: any;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
