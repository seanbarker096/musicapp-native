import { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import * as SecureStore from 'expo-secure-store';
import axios from '../axios-instance';
import { GetRequestConfig, PostRequestConfig, StoreSlice } from './store.types';

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
  body: PostRequestConfig<S>['Body'];
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

  // let processedBody: { [key: string]: any } = {};

  // if (
  //   headers['Content-Type'] &&
  //   headers['Content-Type'] === 'application/json'
  // ) {
  //   JSON.stringify(body);
  // } else {
  //   processedBody = body;
  // }

  // console.log('processedBody', processedBody);

  return await axios.post<
    S['Post']['ResultType'],
    AxiosResponse<S['Post']['ResultType']>
  >(`http://192.168.1.217:5000/api/${url}`, body, postRequestConfig);
}
