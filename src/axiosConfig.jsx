import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL
})

instance.interceptors.request.use(function (config) {
  const persistAuth = localStorage.getItem('persist:auth')
  if (persistAuth) {
    try {
      const authData = JSON.parse(persistAuth)
      // redux-persist stringifies stored nested state, so we parse it again
      const token = authData.token ? JSON.parse(authData.token) : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.error("Failed to parse persist:auth token", e)
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export default instance