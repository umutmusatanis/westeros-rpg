// MOCK MODE - No Backend Required!
import { mockAuthService } from './mockAuthService';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
  token?: string;
  user?: any;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const result = await mockAuthService.register(data.username, data.email, data.password);
    return {
      success: result.success,
      token: result.token,
      user: result.user,
      data: {
        token: result.token,
        user: result.user
      }
    };
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const result = await mockAuthService.login(data.email, data.password);
    return {
      success: result.success,
      token: result.token,
      user: result.user,
      data: {
        token: result.token,
        user: result.user
      }
    };
  },

  getProfile: async () => {
    return { user: mockAuthService.getCurrentUser() };
  },

  logout: () => {
    mockAuthService.logout();
  },

  isAuthenticated: (): boolean => {
    return mockAuthService.isLoggedIn();
  }
};
