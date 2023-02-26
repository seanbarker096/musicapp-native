import { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import * as SecureStore from 'expo-secure-store';
import axios from '../axios-instance';
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
    `http://192.168.1.217:5000/api/${url}`,
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
