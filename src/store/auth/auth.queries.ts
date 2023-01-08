import { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from 'react-query';
import axios from '../../axios-instance';
import {
  loginResultToAuthState,
  signUpResultToAuthState,
} from './auth.transformations';
import {
  LoginFormState,
  LoginMutationResult,
  LoginResultApi,
  SignUpMutationResult,
  SignUpResultApi,
  UserCreateRequestApi,
} from './auth.types';

// const validateAuthState = async (): Promise<ValidateAuthStateApi> => {
//   console.log('wooo');
//   return Promise.reject('asdfasd');
//   const response = await axios.get('/api/auth/0.1/validate');

//   return response.data;
// };

// const transformAuthStateApi = (data: ValidateAuthStateApi): AuthUser => {
//   return {
//     userId: data.user_id,
//     role: data.role,
//     status: data.auth_status,
//   };
// };

// export const useValidateAuthQuery = (state: any) => {
//   return useQuery<ValidateAuthStateApi, unknown, AuthUser>(
//     ['auth', state],
//     validateAuthState,
//     {
//       select: transformAuthStateApi,
//       cacheTime: 0, // Ensure the tokens are not stored as cache keys
//     },
//   );
// };

const login = async ({
  username,
  password,
}: LoginFormState): Promise<LoginMutationResult> => {
  const response = await axios.post<LoginResultApi>(
    'http://192.168.1.217:5000/api/auth/0.1/login',
    {
      username,
      password,
    },
  );

  const authState = loginResultToAuthState(response.data);

  return {
    authState,
    refreshToken: response.data['refresh_token'] ?? undefined,
    accessToken: response.data['access_token'] ?? undefined,
  };
};

export const useLoginMutation = () => {
  const onSuccessCallback = async ({
    refreshToken,
    accessToken,
  }: LoginMutationResult) => {
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    await SecureStore.setItemAsync('access_token', accessToken);
  };

  return useMutation<LoginMutationResult, any, LoginFormState>(
    request => login(request),
    { onSuccess: onSuccessCallback },
  );
};

const authTokenCreate = async (refreshToken: string): Promise<string> => {
  const response = await axios.post(
    'http://192.168.1.217:5000/api/auth/0.1/token',
    { token_type: 'access' },
    {
      headers: { 'Refresh-Token': refreshToken },
    },
  );

  if (!response.data['token']) {
    throw Error('Invalid response from api');
  }

  return response.data['token'];
};

export const useAuthTokenCreateMutation = () => {
  return useMutation<any, any, string>(refreshToken =>
    authTokenCreate(refreshToken),
  );
};

const signUp = async ({
  email,
  firstName,
  secondName,
  password,
  username,
}: SignUpFormValues): Promise<SignUpMutationResult> => {
  const response = await axios.post<
    SignUpResultApi,
    AxiosResponse<SignUpResultApi>,
    UserCreateRequestApi
  >('http://192.168.1.217:5000/api/auth/0.1/signup', {
    email,
    first_name: firstName,
    second_name: secondName,
    username,
    password,
  });

  const authState = signUpResultToAuthState(response.data);

  return {
    authState,
    refreshToken: response.data['refresh_token'] ?? undefined,
    accessToken: response.data['access_token'] ?? undefined,
  };
};

export const useSignUpMutation = () => {
  const onSuccessCallback = async ({
    refreshToken,
    accessToken,
  }: SignUpMutationResult) => {
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    await SecureStore.setItemAsync('access_token', accessToken);
  };

  return useMutation(signUp, { onSuccess: onSuccessCallback });
};
