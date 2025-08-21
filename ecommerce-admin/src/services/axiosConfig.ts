import axios from 'axios';
import { get } from 'lodash';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = cookies.get('authToken');

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  (error) => {
    const errorStatusCode = get(error, 'response.status');
    const apiError = new Error();
    (apiError as any).data = error.response?.data;
    if (error && errorStatusCode === 401) {
      setTimeout(() => {
        cookies.remove('authToken');
        localStorage.clear();
        location.href = '/login';
      }, 1000);

      return Promise.reject(apiError);
    }

    if (error && errorStatusCode === 403) {
      setTimeout(() => {
        location.href = '/forbidden';
      }, 1000);

      return Promise.reject(apiError);
    }
    return Promise.reject(apiError);
  },
);

export default axiosInstance;
