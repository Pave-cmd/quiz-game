import { api, setAuthToken } from '../config/mongodb';

// Pro debugging
console.log('Auth service initialized with API baseURL:', (api.defaults.baseURL || 'default'));

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
  private tokenKey = 'quiz_auth_token';
  private userKey = 'quiz_user';

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      this.setSession(response.data);
      window.dispatchEvent(new Event('storage')); // Trigger aktualizace UserInfo
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      this.setSession(response.data);
      window.dispatchEvent(new Event('storage')); // Trigger aktualizace UserInfo
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    this.clearSession();
    window.dispatchEvent(new Event('storage')); // Trigger aktualizace UserInfo
  }

  async checkAuth(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      await api.get('/auth/verify');
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserInfo(): { id: string; email: string; username: string } | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
    setAuthToken(authResponse.token);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    setAuthToken('');
  }

  private handleError(error: any): Error {
    console.error('Auth error:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Chyba při autentizaci');
    }
    throw new Error('Chyba při připojení k serveru');
  }
}

export const authService = new AuthService();