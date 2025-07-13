import axios from 'axios'

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Example: Attach auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      // Optionally, redirect to login or clear auth
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    }
    // Optionally, show a notification
    // $q.notify({ type: 'negative', message: error.message })
    return Promise.reject(error)
  }
)

export default api
