import axios from "axios";

/**
 * Base API URL for public endpoints.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Axios instance configured for public API requests.
 */
export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1/public`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Request interceptor for logging and modifications.
 */
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for error handling.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
