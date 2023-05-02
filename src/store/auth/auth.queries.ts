import { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { postRequest } from 'store/request-builder';
import axios from '../../axios-instance';
import { AuthStateContext } from './auth.contexts';
import {
  loginResultToAuthState,
  signUpResultToAuthState,
} from './auth.transformations';
import {
  AuthStatus,
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
    'http://192.168.1.217:5000/api/auth/0.1/login/',
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

// TODO: Do we need to invalidate any othert instances of this query??
const authTokenCreate = async (refreshToken: string): Promise<string> => {
  const { authState, setAuthState } = useContext(AuthStateContext);

  const response = await postRequest({
    url: 'http://192.168.1.217:5000/api/auth/0.1/token/',
    body: { token_type: 'access' },
    headers: { 'Refresh-Token': refreshToken },
  }).catch(error => {
    if (
      error.response &&
      error.reponse.data.error_code === 'INVALID_REFRESH_TOKEN'
    ) {
      setAuthState({
        authUser: authState.authUser,
        status: AuthStatus.UNAUTHENTICATED,
      });
    }
    throw error;
  });

  if (!response.data['token']) {
    throw Error('Invalid response from api');
  }

  // Return the access token, which we needed the refresh token in order to create
  return response.data['token'];
};

export const useAuthTokenCreateMutation = () => {
  return useMutation<string, any, string>(refreshToken =>
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
  >('http://192.168.1.217:5000/api/auth/0.1/signup/', {
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

// TODO: Pass in reuqest valuse to signup
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
