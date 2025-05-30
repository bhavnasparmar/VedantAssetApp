import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios';

import { API_URL, decryptData, TOKEN_PREFIX, tokenExpiredflagChange } from './Commanutils';
import { getData, localStorageKeys } from '../services/localStorageService';

/**
 * Get user-friendly error message based on HTTP status
 */
const getMessageFromStatus = (status: number, msg: string | null): string => {
  switch (status) {
    case 400:
      return msg || 'Bad Request';
    case 401:
      return msg || 'Unauthorized - Please login again';
    case 409:
      return msg || 'Conflict - Already exists';
    case 500:
      return msg || 'Internal Server Error';
    default:
      return msg || 'Unexpected Server Error';
  }
};

/**
 * Format API error response into a consistent object/array
 */
const formatError = (err: any) => {
  let formatted: any = { msg: '', status: null, field: null };

  if (typeof err?.data === 'string') {
    formatted.msg = getMessageFromStatus(err?.status, err?.data);
    formatted.status = err?.status;
  } else if (err?.data?.err?.errors) {
    // Sequelize errors
    formatted = err.data.err.errors.map((e: any) => ({
      msg: e.message,
      field: e.path,
      status: err.status,
    }));
  } else if (Array.isArray(err?.data) && err.data[0]?.errors?.issues) {
    // Zod validation errors
    const firstIssue = err.data[0].errors.issues[0];
    formatted = {
      msg: firstIssue?.message || 'Validation Error',
      field: firstIssue?.path?.[0] || null,
      status: err?.status,
    };
  } else if (err?.data?.required?.errors) {
    // Express-validator style errors
    formatted = err.data.required.errors.map((e: any) => ({
      msg: e.msg,
      field: e.param,
      status: err.status,
    }));
  } else if (err?.data?.msg) {
    formatted.msg = err.data.msg;
    formatted.status = err.status;
  } else {
    formatted.msg = getMessageFromStatus(err?.status, null);
    formatted.status = err?.status;
  }

  return formatted;
};

/**
 * Create axios instance with interceptors
 */
const fetchClient = (): AxiosInstance => {
  const defaultOptions: AxiosRequestConfig = {
    baseURL: API_URL,
    // timeout: 10000, 
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const instance = axios.create(defaultOptions);

  // Request Interceptor - Attach token
  instance.interceptors.request.use(async config => {
    try {
      const token = await getData(TOKEN_PREFIX);
      console.log('config : ', config)
      if (token) config.headers.Authorization = token;
    } catch (error) {
      console.log('Token fetch error:', error);
    }
    return config;
  });

  // Response Interceptor - Decrypt and handle errors
  instance.interceptors.response.use(
    async (response: any) => {


      if (response?.data?.data) {
        // decryptData(response.data.data);
        // return { data: decryptData(response.data.data),msg: response?.data?.msg,};
      }
      return response?.data;
    },
    async (error: AxiosError) => {
      const status = error?.response?.status;
//console.log("error api -----",JSON.parse(error?.response))
      console.log('API Error Response:', {
        statusCode: status,
        endpoint: error?.config?.url,
        method: error?.config?.method,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });

      if (status === 401) {
        console.log('🔒 Token Expired');
        tokenExpiredflagChange(true);
      }
      // Handle common network errors
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        return Promise.reject({
          msg: 'No Internet Connection',
          status: null,
          field: null,
        });
      }

      const formattedError = formatError(error?.response);
      return Promise.reject(formattedError);
    },
  );

  return instance;
};

export default fetchClient();
