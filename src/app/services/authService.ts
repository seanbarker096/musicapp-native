import { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Platform } from 'react-native';
import { useMutation } from 'react-query';
import { AuthStateContext } from 'store/auth/auth.contexts';
import {
  AuthState,
  AuthStatus,
  AuthUser,
  AuthUserApi,
} from 'store/auth/auth.types';
import { useIntervalEffect } from 'utils/custom-hooks';
import axios from '../../axios-instance';

export const ACCESS_TOKEN_EXPIRY_TIME = 60 * 60 * 1000;

// TODO: Do we need to invalidate any othert instances of this query??
const authTokenCreate = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    Promise.reject('Unsupported platform');
  }
  const refreshToken = await SecureStore.getItemAsync('refresh_token');

  // If no refresh token is found, return early. The user will need to log in to get one
  if (!refreshToken) {
    Promise.reject('No refresh token found');
  }

  // We are going to use refresh token to get a new access token, so delete the old one
  try {
    await SecureStore.deleteItemAsync('access_token');
  } catch (e) {}

  const response = await axios.post<
    { token: string },
    AxiosResponse<{ token: string }>,
    { token_type: string }
  >(
    'http://192.168.1.217:5000/api/auth/0.1/token/',
    { token_type: 'access' },
    { headers: { 'Refresh-Token': refreshToken } },
  );

  console.log('new acess token retrieved:', response.data.token);
  return response.data.token;
};

/**
 * @param Optional onError callback which for setting the user as unauthenticated
 */
const useAuthTokenCreateMutation = ({
  onAuthTokenCreateError,
  onAuthTokenCreateSuccess,
}: {
  onAuthTokenCreateError?: (authContext: AuthStateContext) => void;
  onAuthTokenCreateSuccess?: (accessToken: string) => void;
} = {}) => {
  let options = {};

  if (onAuthTokenCreateError) {
    options = { onError: onAuthTokenCreateError };
  }

  if (onAuthTokenCreateSuccess) {
    options = { ...options, onSucess: onAuthTokenCreateSuccess };
  }

  return useMutation<string, any, void>(authTokenCreate, options);
};

export async function authenticateUserOnAppStartup(
  setAuthState: Dispatch<SetStateAction<AuthState | undefined>>,
) {
  const onAuthenticateSuccess = (accessToken: string) => {
    SecureStore.setItemAsync('access_token', accessToken);

    const authUser = buildAuthUserFromAuthToken(accessToken);

    setAuthState({ status: AuthStatus.AUTHENTICATED, authUser });
  };

  const { mutate } = useAuthTokenCreateMutation({
    onAuthTokenCreateSuccess: onAuthenticateSuccess,
  });

  useEffect(() => {
    const _authenticateUser = async () => {
      // We are going to use refresh token to get a new access token, so delete the old one
      try {
        await SecureStore.deleteItemAsync('access_token');
      } catch (e) {}

      mutate();
    };
    _authenticateUser();
  }, []);
}

export function useReauthenticateUserEffect({
  authState,
  setAuthState,
}: {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}) {
  const unAuthenticateOnError = () =>
    setAuthState({
      authUser: authState.authUser,
      status: AuthStatus.UNAUTHENTICATED,
    });

  const onCreateAccessTokenSuccess = (accessToken: string) => {
    SecureStore.setItemAsync('access_token', accessToken);

    const newAuthUser = buildAuthUserFromAuthToken(accessToken);

    setAuthState({
      authUser: newAuthUser,
      status: AuthStatus.AUTHENTICATED,
    });
  };

  const { mutate, isLoading, isError, isSuccess, error } =
    useAuthTokenCreateMutation({
      onAuthTokenCreateError: unAuthenticateOnError,
      onAuthTokenCreateSuccess: onCreateAccessTokenSuccess,
    });

  useIntervalEffect<never>(mutate, ACCESS_TOKEN_EXPIRY_TIME);
}

const buildAuthUserFromAuthToken = (token: string): AuthUser => {
  const { role, user_id: userId } = jwt_decode<AuthUserApi>(token);

  if (!role || !userId) {
    throw Error('Invalid token provided');
  }

  return { role, userId };
};
