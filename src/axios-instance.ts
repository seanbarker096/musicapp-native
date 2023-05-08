import { BASE_URL } from '@env';
import axios, { AxiosError } from 'axios';
import { ApiError, ErrorCodes } from 'store/backend-errors.types';
import { RequestTypes, StoreSlice } from 'store/store.types';

console.log(BASE_URL);

const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.defaults.headers.post['Content-Type'] = 'application/json';

export default appAxios;

export function transformAxiosError<T extends keyof ErrorCodes>(
  error: AxiosError<ApiError<T>>,
): ApiError<T>;
export function transformAxiosError<
  S extends StoreSlice,
  R extends RequestTypes,
>(error: AxiosError<ApiError<S[R]['ErrorType']>>): ApiError<S[R]['ErrorType']> {
  return {
    status: 'error',
    error_code: error.response?.data.error_code ?? 'UNKNOWN_ERROR',
    detail: error.response?.data.detail ?? 'Unknown error',
  };
}
