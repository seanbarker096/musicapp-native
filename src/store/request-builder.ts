import { reAuthenticateUser } from 'app/services/authService';
import { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import axios from '../axios-instance';
import { AuthStateContext } from './auth/auth.contexts';
import { GetRequestConfig, StoreSlice } from './store.types';

export async function getRequest<S extends StoreSlice>({
  url,
  params,
  headers = {},
}: {
  url: string;
  params: GetRequestConfig<S>['Params'];
  headers?: RawAxiosRequestHeaders;
}): Promise<AxiosResponse<S['Get']['ResultType']>> {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  const getRequestConfig = {
    headers: {
      ...headers,
      'Refresh-Token': refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  return axios
    .get<S['Get']['ResultType']>(
      `http://192.168.1.217:5000/api/${url}`,
      getRequestConfig,
    )
    .catch(error => {
      if (error.response && error.response.status === 401) {
        // call the reAuthenticate function here as a side effect to prevent errors in future requsts or reattempts. Whatever the result, reject with the original error
        return attemptToRevalidateSession()
          .then(() => Promise.reject(error))
          .catch(() => Promise.reject(error));
      } else {
        return Promise.reject(error);
      }
    });
}

export async function postRequest<S extends StoreSlice>({
  url,
  body,
  headers = {},
}: {
  url: string;
  body: S['Post']['RequestBodyType'];
  headers?: RawAxiosRequestHeaders;
}): Promise<AxiosResponse<S['Post']['ResultType']>> {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  const postRequestConfig = {
    headers: {
      ...headers,
      'Refresh-Token': refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return await axios.post<
    S['Post']['ResultType'],
    AxiosResponse<S['Post']['ResultType']>,
    S['Post']['RequestBodyType']
  >(`http://192.168.1.217:5000/api/${url}`, body, postRequestConfig);
}

export async function searchRequest<S extends StoreSlice>({
  url,
  body,
  headers = {},
}: {
  url: string;
  body: S['Search']['RequestBodyType'];
  headers?: RawAxiosRequestHeaders;
}): Promise<AxiosResponse<S['Search']['ResultType']>> {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  const searchRequestConfig = {
    headers: {
      ...headers,
      'Refresh-Token': refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return await axios.post<
    S['Search']['ResultType'],
    AxiosResponse<S['Search']['ResultType']>,
    S['Search']['RequestBodyType']
  >(`http://192.168.1.217:5000/api/${url}`, body, searchRequestConfig);
}

export async function deleteRequest<S extends StoreSlice>({
  url,
  params,
  headers = {},
}: {
  url: string;
  params: S['Delete']['RequestParametersType'];
  headers?: RawAxiosRequestHeaders;
}): Promise<AxiosResponse<S['Delete']['ResultType']>> {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  const getRequestConfig = {
    headers: {
      ...headers,
      'Refresh-Token': refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  return axios.delete<
    S['Delete']['ResultType'],
    AxiosResponse<S['Delete']['ResultType']>,
    S['Delete']['RequestParametersType']
  >(`http://192.168.1.217:5000/api/${url}`, getRequestConfig);
}

// attemptToRevalidateSession

// if no refresh token, take to login screen

// if refresh token, attempt to revalidate session

// if fails then retry X times and if still fails then take to login screen

// if succeeds then update tokens and retry original request

async function attemptToRevalidateSession() {
  const { setAuthState, authState } = useContext(AuthStateContext);

  try {
    await reAuthenticateUser();
  } catch (error) {}
}
