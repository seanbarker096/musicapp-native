import { LoggedOutPage, SetLoggedOutPage } from 'app/app-types';
import { AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Platform } from 'react-native';
import { UseMutationOptions, useMutation } from 'react-query';
import { AuthStateContext } from 'store/auth/auth.contexts';
import {
  AuthState,
  AuthStatus,
  AuthUser,
  AuthUserApi,
} from 'store/auth/auth.types';
import { useIntervalEffect } from 'utils/custom-hooks';
import { isDefined } from 'utils/utils';
import axios from '../../axios-instance';

// Access tokens are valid for 60 minutes, so we refresh them every 55 minutes
export const ACCESS_TOKEN_EXPIRY_TIME = 55 * 60 * 1000;

export interface RefreshTokenPayload {
  user_id: number;
  type: number;
  role: number;
  session_id: string;
  exp: number;
}

// TODO: Do we need to invalidate any othert instances of this query??
async function authTokenCreate(): Promise<string> {
  if (Platform.OS === 'web') {
    Promise.reject('Unsupported platform');
  }
  const refreshToken = await SecureStore.getItemAsync('refresh_token');

  // If no refresh token is found, return early. The user will need to log in to get one
  if (!isDefined(refreshToken)) {
    return Promise.reject(new Error('No refresh token found'));
  }

  if (refreshTokenWillExpireBeforeAuthTokenFetched(refreshToken)) {
    return Promise.reject(new Error('Refresh token expired'));
  } else {
    const response = await getAccessToken(refreshToken);

    return response.data.token;
  }
}

function getAccessToken(refreshToken: string) {
  return axios.post<
    { token: string },
    AxiosResponse<{ token: string }>,
    { token_type: string }
  >(
    `${Constants.expoConfig?.extra?.baseUrl}/api/auth/0.1/token/`,
    { token_type: 'access' },
    { headers: { 'Refresh-Token': refreshToken } },
  );
}

/**
 * @param Optional onError callback which for setting the user as unauthenticated
 */
const useAuthTokenCreateMutation = ({
  onAuthTokenCreateError,
  onAuthTokenCreateSuccess,
}: {
  onAuthTokenCreateError?: (authContext: AuthStateContext) => void;
  onAuthTokenCreateSuccess?: (token: string) => void;
}) => {
  let options: UseMutationOptions<string, any, void> = {};

  if (onAuthTokenCreateError) {
    options = { onError: onAuthTokenCreateError };
  }

  if (onAuthTokenCreateSuccess) {
    options = { ...options, onSuccess: onAuthTokenCreateSuccess };
  }

  return useMutation<string, unknown, void>(authTokenCreate, options);
};

export async function authenticateUserOnAppStartup(
  setAuthState: Dispatch<SetStateAction<AuthState | undefined>>,
) {
  const onAuthenticateSuccess = (accessToken: string) => {
    SecureStore.setItemAsync('access_token', accessToken);

    const newAuthUser = buildAuthUserFromAuthToken(accessToken);

    setAuthState({
      authUser: newAuthUser,
      status: AuthStatus.AUTHENTICATED,
    });
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
  setLoggedOutPage,
}: {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  setLoggedOutPage: SetLoggedOutPage;
}) {
  // TODO: Optimize to only setAuth state if its changed, otherwise app refreshes entirely every 10 mins
  const onCreateAccessTokenSuccess = (accessToken: string) => {
    SecureStore.setItemAsync('access_token', accessToken);

    const newAuthUser = buildAuthUserFromAuthToken(accessToken);

    if (authState.status === AuthStatus.UNAUTHENTICATED) {
      setAuthState({
        authUser: newAuthUser,
        status: AuthStatus.AUTHENTICATED,
      });
    }
  };

  const onAuthTokenCreateError = () => {
    setLoggedOutPage(LoggedOutPage.SESSION_EXPIRED);
    setAuthState({
      authUser: authState.authUser,
      status: AuthStatus.UNAUTHENTICATED,
    });
  };

  const { mutate, isLoading, isError, isSuccess, error } =
    useAuthTokenCreateMutation({
      onAuthTokenCreateError: onAuthTokenCreateError,
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

function refreshTokenWillExpireBeforeAuthTokenFetched(refreshToken: string) {
  // Decode the refresh. Check its expiry time. If the token will expire before the next ACCESS_TOKEN_EXPIRY_TIME, then
  // return early
  const { exp, user_id: userId } =
    jwt_decode<RefreshTokenPayload>(refreshToken);

  const timeUntilExpiry = exp * 1000 - Date.now();

  return timeUntilExpiry <= ACCESS_TOKEN_EXPIRY_TIME;
}