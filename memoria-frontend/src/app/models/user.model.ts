export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}
