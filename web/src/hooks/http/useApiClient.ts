import axios from 'axios'
import { env } from '../../env'

const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (!error.response || error.response.status >= 500) {
      console.error(error)
    }
    return Promise.reject(error)
  },
)

export const useApiClient = () => {
  const apiCall = async <T = unknown>(
    endpoint: string,
    options = {},
  ): Promise<T> => {
    const response = await apiClient({
      url: endpoint,
      ...options,
    })

    return response as T
  }

  return { apiCall }
}
