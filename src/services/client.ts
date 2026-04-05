import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Response interceptor for error logging
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  },
);

/**
 * HTTP client wrapper with typed responses
 */
const http = {
  get: async <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await instance.get(url, config);
    return response.data;
  },

  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await instance.post(url, data, config);
    return response.data;
  },

  put: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await instance.put(url, data, config);
    return response.data;
  },

  patch: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await instance.patch(url, data, config);
    return response.data;
  },

  del: async <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await instance.delete(url, config);
    return response.data;
  },
};

export default http;
