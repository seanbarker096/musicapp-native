import { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import axios, { transformAxiosError } from '../axios-instance';
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

  return axios.get<S['Get']['ResultType']>(
    `${Constants.expoConfig?.extra?.baseUrl}/api/${url}`,
    getRequestConfig,
  );
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
  try {
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
    >(
      `${Constants.expoConfig?.extra?.baseUrl}/api/${url}`,
      body,
      postRequestConfig,
    );
  } catch (e: any) {
    return Promise.reject(transformAxiosError<S, 'Post'>(e));
  }
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
  >(
    `${Constants.expoConfig?.extra?.baseUrl}/api/${url}`,
    body,
    searchRequestConfig,
  );
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
  >(`${Constants.expoConfig?.extra?.baseUrl}/api/${url}`, getRequestConfig);
}

export async function patchRequest<S extends StoreSlice>({
  url,
  body,
  headers = {},
}: {
  url: string;
  body: S['Patch']['RequestBodyType'];
  headers?: RawAxiosRequestHeaders;
}): Promise<AxiosResponse<S['Patch']['ResultType']>> {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  const patchRequestConfig = {
    headers: {
      ...headers,
      'Refresh-Token': refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return await axios.patch<
    S['Patch']['ResultType'],
    AxiosResponse<S['Patch']['ResultType']>,
    S['Patch']['RequestBodyType']
  >(
    `${Constants.expoConfig?.extra?.baseUrl}/api/${url}`,
    body,
    patchRequestConfig,
  );
}
