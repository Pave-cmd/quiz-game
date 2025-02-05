// src/services/authService.ts
import { api, setAuthToken } from '../config/mongodb';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  username: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    setAuthToken('');
  }

  async checkAuth(): Promise<boolean> {
    try {
      await api.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      throw new Error(error.response.data.message || 'Chyba při autentizaci');
    }
    throw new Error('Chyba při připojení k serveru');
  }
}

export const authService = new AuthService();