import { SignUpFormValues } from 'app/signup/SignUpForm';
import { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { isDefined } from 'utils/utils';
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
  password,
  username,
}: SignUpFormValues): Promise<SignUpMutationResult> => {
  const response = await axios.post<
    SignUpResultApi,
    AxiosResponse<SignUpResultApi>,
    UserCreateRequestApi
  >('http://192.168.1.217:5000/api/auth/0.1/signup/', {
    email,
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

// ----------------------------- Logout ----------------------------- //

async function logout() {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  // Shouldn't happen, but if for some reason there is not refresh token when signing out, dont make api call as they are technically already unauthenticated. Our onsucess callback will mark the user as unautenticated
  if (!isDefined(refreshToken)) {
    return Promise.resolve();
  }

  await axios.post<void, AxiosResponse<void>, void>(
    'http://192.168.1.217:5000/api/auth/0.1/logout/',
    undefined,
    {
      headers: {
        'Refresh-Token': refreshToken,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return Promise.resolve();
}

export const useLogoutMutation = () => {
  const { authState, setAuthState } = useContext(AuthStateContext);

  const onSuccessCallback = async () => {
    setAuthState({
      authUser: authState.authUser,
      status: AuthStatus.UNAUTHENTICATED,
    });

    // All tokens are invalidated on backend on logout, so delete them from users device
    try {
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('access_token');
    } catch (error) {}
  };

  return useMutation<void, unknown, void>(logout, {
    onSuccess: onSuccessCallback,
  });
};