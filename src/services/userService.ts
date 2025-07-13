import api from '@/api/axios'

// Types for user operations
export interface UserData {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
}

class UserService {
  private readonly resource = '/users'

  /**
   * Get all users
   */
  getUsers(params?: any) {
    return api.get(this.resource, { params })
  }

  /**
   * Get user by ID
   */
  getUser(id: string) {
    return api.get(`${this.resource}/${id}`)
  }

  /**
   * Create new user
   */
  createUser(userData: CreateUserData) {
    return api.post(this.resource, userData)
  }

  /**
   * Update user
   */
  updateUser(id: string, userData: UpdateUserData) {
    return api.put(`${this.resource}/${id}`, userData)
  }

  /**
   * Delete user
   */
  deleteUser(id: string) {
    return api.delete(`${this.resource}/${id}`)
  }

  /**
   * Get user profile
   */
  getUserProfile() {
    return api.get(`${this.resource}/profile`)
  }

  /**
   * Update user profile
   */
  updateUserProfile(userData: UpdateUserData) {
    return api.put(`${this.resource}/profile`, userData)
  }
}

// Export singleton instance
export const userService = new UserService()
export default userService
