import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface AuthResponse {
  user: User
  token: string
  refresh_token: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response
      const response: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: 'John Doe',
        },
        token: 'mock-jwt-token',
        refresh_token: 'mock-refresh-token',
      }

      // Store auth data
      user.value = response.user
      token.value = response.token
      refreshToken.value = response.refresh_token

      // Store in localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('refresh_token', response.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return true
    } catch (err) {
      error.value = 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response
      const response: AuthResponse = {
        user: {
          id: '1',
          email: data.email,
          name: data.name,
        },
        token: 'mock-jwt-token',
        refresh_token: 'mock-refresh-token',
      }

      // Store auth data
      user.value = response.user
      token.value = response.token
      refreshToken.value = response.refresh_token

      // Store in localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('refresh_token', response.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return true
    } catch (err) {
      error.value = 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    // Clear state
    user.value = null
    token.value = null
    refreshToken.value = null
    error.value = null

    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  const validateToken = async (): Promise<boolean> => {
    if (!token.value) return false

    try {
      // Simulate API call to validate token
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock validation - in real app, this would call your API
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  const refreshAuthToken = async (): Promise<boolean> => {
    if (!refreshToken.value) return false

    try {
      // Simulate API call to refresh token
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock new token
      const newToken = 'new-mock-jwt-token'
      token.value = newToken
      localStorage.setItem('token', newToken)

      return true
    } catch (err) {
      logout()
      return false
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user.value) return false

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = 'Profile update failed'
      return false
    }
  }

  const initializeAuth = async (): Promise<void> => {
    // Check for stored auth data
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedRefreshToken = localStorage.getItem('refresh_token')

    if (storedToken && storedUser && storedRefreshToken) {
      token.value = storedToken
      refreshToken.value = storedRefreshToken
      user.value = JSON.parse(storedUser)

      // Validate token
      const isValid = await validateToken()
      if (!isValid) {
        logout()
      }
    }
  }

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    currentUser,

    // Actions
    login,
    register,
    logout,
    validateToken,
    refreshAuthToken,
    updateProfile,
    initializeAuth,
  }
})
