import api from '@/api/axios'

// Types for authentication
export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
}

class AuthService {
  private readonly resource = '/auth'

  /**
   * Login user with email and password
   */
  login(credentials: LoginCredentials) {
    return api.post(`${this.resource}/login`, credentials)
  }

  /**
   * Register new user
   */
  register(userData: LoginCredentials & { name: string }) {
    return api.post(`${this.resource}/register`, userData)
  }

  /**
   * Get current user profile
   */
  getCurrentUser() {
    return api.get(`${this.resource}/me`)
  }

  /**
   * Update user profile
   */
  updateProfile(userData: UpdateUserData) {
    return api.put(`${this.resource}/profile`, userData)
  }

  /**
   * Delete user account
   */
  deleteAccount() {
    return api.delete(`${this.resource}/account`)
  }

  /**
   * Logout user
   */
  logout() {
    return api.post(`${this.resource}/logout`)
  }

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string) {
    return api.post(`${this.resource}/refresh`, { refreshToken })
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
