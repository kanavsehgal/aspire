import { ref, computed, readonly } from 'vue'
import authService, {
  type LoginCredentials,
  type User,
  type UpdateUserData,
} from '../services/authService'

export function useAuth() {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'))
  const isLoggedIn = computed(() => !!user.value)

  // Login function
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      // Store tokens in localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('refresh_token', response.data.refreshToken)
        user.value = response.data.user
      }

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Register function
  const register = async (userData: LoginCredentials & { name: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(userData)

      // Store tokens in localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('refresh_token', response.data.refreshToken)
        user.value = response.data.user
      }

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get current user
  const getCurrentUser = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.getCurrentUser()
      user.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to get user'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update profile
  const updateProfile = async (userData: UpdateUserData) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.updateProfile(userData)
      user.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete account
  const deleteAccount = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.deleteAccount()

      // Clear tokens from localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      user.value = null

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete account'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.logout()

      // Clear tokens from localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      user.value = null

      return response
    } catch (err: any) {
      // Even if the API call fails, clear local tokens
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      user.value = null

      error.value = err.response?.data?.message || 'Logout failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Refresh token
  const refreshToken = async () => {
    loading.value = true
    error.value = null

    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken)

      // Update token in localStorage
      localStorage.setItem('auth_token', response.data.token)

      return response
    } catch (err: any) {
      // Clear tokens if refresh fails
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      user.value = null

      error.value = err.response?.data?.message || 'Token refresh failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Initialize auth state
  const initializeAuth = async () => {
    if (isAuthenticated.value) {
      try {
        await getCurrentUser()
      } catch (err) {
        // If getting user fails, clear tokens
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
    }
  }

  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    isAuthenticated,
    isLoggedIn,

    // Methods
    login,
    register,
    getCurrentUser,
    updateProfile,
    deleteAccount,
    logout,
    refreshToken,
    clearError,
    initializeAuth,
  }
}
