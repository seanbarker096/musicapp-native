import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { GetRequestConfig, StoreSlice } from './store.types';

export async function getRequest<S extends StoreSlice>({
  url,
  params,
}: {
  url: string;
  params: GetRequestConfig<S>['Params'];
}) {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  const getRequestConfig = {
    headers: {
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
