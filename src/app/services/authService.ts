import { AxiosResponse } from 'axios';
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
  LoginResultApi,
} from 'store/auth/auth.types';
import { useIntervalEffect } from 'utils/custom-hooks';
import { isDefined } from 'utils/utils';
import axios from '../../axios-instance';

export const ACCESS_TOKEN_EXPIRY_TIME = 4 * 1000;

export interface RefreshTokenPayload {
  user_id: number;
  type: number;
  role: number;
  session_id: string;
  exp: number;
}
interface TokensGetResult {
  accessToken: string;
  refreshToken?: string;
}
// TODO: Do we need to invalidate any othert instances of this query??
async function authTokenCreate(): Promise<TokensGetResult> {
  if (Platform.OS === 'web') {
    Promise.reject('Unsupported platform');
  }
  const refreshToken = await SecureStore.getItemAsync('refresh_token');

  // If no refresh token is found, return early. The user will need to log in to get one
  if (!isDefined(refreshToken)) {
    return Promise.reject('No refresh token found');
  }

  // Decode the refresh. Check its expiry time. If the token will expire before the next ACCESS_TOKEN_EXPIRY_TIME, then
  // return early
  const { exp, user_id: userId } =
    jwt_decode<RefreshTokenPayload>(refreshToken);

  const timeUntilExpiry = exp * 1000 - Date.now();

  let tokens: TokensGetResult | undefined = undefined;

  if (timeUntilExpiry <= ACCESS_TOKEN_EXPIRY_TIME) {
    const appifr = await SecureStore.getItemAsync('appifr');

    if (!isDefined(appifr)) {
      return Promise.reject('No appifr found');
    }

    const response = await getRefreshAndAccessToken(userId, appifr);

    tokens = {
      refreshToken: response.data.refresh_token,
      accessToken: response.data.access_token,
    };
  } else {
    const response = await getAccessToken(refreshToken);

    tokens = {
      refreshToken: undefined,
      accessToken: response.data.token,
    };
  }

  return tokens;
}

function getAccessToken(refreshToken: string) {
  return axios.post<
    { token: string },
    AxiosResponse<{ token: string }>,
    { token_type: string }
  >(
    'http://192.168.1.217:5000/api/auth/0.1/token/',
    { token_type: 'access' },
    { headers: { 'Refresh-Token': refreshToken } },
  );
}

function getRefreshAndAccessToken(userId: number, appifr: string) {
  return axios.post<
    LoginResultApi,
    AxiosResponse<LoginResultApi>,
    { user_id: number }
  >(
    'http://192.168.1.217:5000/api/auth/0.1/refresh-token/',
    { user_id: userId },
    { headers: { 'x-appifr': appifr } },
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
  onAuthTokenCreateSuccess?: (tokens: TokensGetResult) => void;
}) => {
  let options: UseMutationOptions<TokensGetResult, any, void> = {};

  if (onAuthTokenCreateError) {
    options = { onError: onAuthTokenCreateError };
  }

  if (onAuthTokenCreateSuccess) {
    options = { ...options, onSuccess: onAuthTokenCreateSuccess };
  }

  return useMutation<TokensGetResult, unknown, void>(authTokenCreate, options);
};

export async function authenticateUserOnAppStartup(
  setAuthState: Dispatch<SetStateAction<AuthState | undefined>>,
) {
  const onAuthenticateSuccess = ({
    accessToken,
    refreshToken,
  }: TokensGetResult) => {
    SecureStore.setItemAsync('access_token', accessToken);

    if (refreshToken) {
      SecureStore.setItemAsync('refresh_token', refreshToken);
    }

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
}: {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}) {
  const unAuthenticateOnError = () =>
    setAuthState({
      authUser: authState.authUser,
      status: AuthStatus.UNAUTHENTICATED,
    });

  // TODO: Optimize to only setAuth state if its changed, otherwise app refreshes entirely every 10 mins
  const onCreateAccessTokenSuccess = ({
    accessToken,
    refreshToken,
  }: TokensGetResult) => {
    SecureStore.setItemAsync('access_token', accessToken);

    if (refreshToken) {
      SecureStore.setItemAsync('refresh_token', refreshToken);
    }

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
