import { showErrorAlert } from '@/utils/alert';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { debounce, get } from 'lodash';
import { Cookies } from 'react-cookie';

const showAuthErrorDebounce = debounce(
  () => {
    showErrorAlert('Session time out. You will be redirected to login page in 3 seconds');
  },
  3000,
  { leading: true, trailing: true },
);

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
    return Promise.reject(error);
  },
);

export default axiosInstance;
