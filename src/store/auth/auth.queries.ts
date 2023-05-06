import { SignUpFormValues } from 'app/signup/SignUpForm';
import { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from 'react-query';
import { isDefined } from 'utils/utils';
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
    'http://192.168.1.217:5000/api/auth/0.1/login/',
    {
      username,
      password,
    },
  );

  const authState = loginResultToAuthState(response.data);

  const apiKey = response.headers['x-appifr'];

  if (isDefined(apiKey)) {
    await SecureStore.setItemAsync('appifr', apiKey);
  }

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

  const apiKey = response.headers['x-appifr'];

  if (isDefined(apiKey)) {
    await SecureStore.setItemAsync('appifr', apiKey);
  }

  return {
    authState,
    refreshToken: response.data['refresh_token'] ?? undefined,
    accessToken: response.data['access_token'] ?? undefined,
  };
};

// TODO: Pass in reuqest valuse to signup
export const useSignUpMutation = ({
  onSuccess,
}: {
  onSuccess: (result: SignUpMutationResult) => void;
}) => {
  const onSuccessCallback = async (result: SignUpMutationResult) => {
    onSuccess(result);

    const { refreshToken, accessToken } = result;

    await SecureStore.setItemAsync('refresh_token', refreshToken);
    await SecureStore.setItemAsync('access_token', accessToken);
  };

  return useMutation<SignUpMutationResult, unknown, SignUpFormValues>(signUp, {
    onSuccess: onSuccessCallback,
  });
};
