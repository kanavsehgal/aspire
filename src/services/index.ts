// Export all services
export { default as authService } from './authService'
export type { LoginCredentials, User, LoginResponse, UpdateUserData } from './authService'

export { default as userService } from './userService'
export type { UserData, CreateUserData, UpdateUserData as UserUpdateData } from './userService'

// You can add more services here as needed
// export { default as productService } from './productService'
// export { default as orderService } from './orderService'
