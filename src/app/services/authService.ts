import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useAuthTokenCreateMutation } from 'store/auth/auth.queries';
import {
  AuthState,
  AuthStatus,
  AuthUser,
  AuthUserApi,
} from 'store/auth/auth.types';

export async function authenticateUserOnAppStartup(
  setAuthState: Dispatch<SetStateAction<AuthState | undefined>>,
) {
  const { mutateAsync } = useAuthTokenCreateMutation();

  useEffect(() => {
    const _authenticateUser = async () => {
      if (Platform.OS === 'web') {
        return;
      }
      const refreshToken = await SecureStore.getItemAsync('refresh_token');

      // If no refresh token is found, return early. The user will need to log in to get one
      if (!refreshToken) {
        return;
      }

      // We are going to use refresh token to get a new access token, so delete the old one
      try {
        await SecureStore.deleteItemAsync('access_token');
      } catch (e) {}

      try {
        const accessToken = await mutateAsync(refreshToken);

        await SecureStore.setItemAsync('access_token', accessToken);

        const authUser = buildAuthUserFromAuthToken(accessToken);

        SecureStore.setItemAsync('access_token', accessToken);

        setAuthState({ status: AuthStatus.AUTHENTICATED, authUser });
      } catch (e) {}
    };
    _authenticateUser();
  }, []);
}

/**
 * Authenticates the user ASSUMING that a refresh token is already available. This is used to create a new acess token. If no refresh token is available please use authenticateUser.
 */
export function useReAuthenticateUserEffect(dependecy: any[]) {
  useEffect(() => {
    reAuthenticateUser();
  }, dependecy);
}

export async function reAuthenticateUser() {
  const { setAuthState, authState } = useContext(AuthStateContext);
  const {
    mutateAsync: createToken,
    isLoading: tokenCreateLoading,
    isError: tokenCreateError,
  } = useAuthTokenCreateMutation();

  const refreshToken = await SecureStore.getItemAsync('refresh_token');

  // If the user has no refresh token, we wont be able to get another access token to keep their session authenticated. They will need to log in again to get a new refresh token
  if (!refreshToken) {
    setAuthState({
      authUser: authState.authUser,
      status: AuthStatus.UNAUTHENTICATED,
    });
    return;
  }

  try {
    await SecureStore.deleteItemAsync('access_token');
  } catch (e) {}

  const accessToken = await createToken(refreshToken);

  // If error, useAuthTOkenCreateMutation will have already set the auth state to unauthenticated, so just return
  if (tokenCreateError) {
    return;
  }

  await SecureStore.setItemAsync('access_token', accessToken);

  const newAuthUser = buildAuthUserFromAuthToken(accessToken);

  setAuthState({
    authUser: newAuthUser,
    status: AuthStatus.AUTHENTICATED,
  });

  return authState;
}

const buildAuthUserFromAuthToken = (token: string): AuthUser => {
  const { role, user_id: userId } = jwt_decode<AuthUserApi>(token);

  if (!role || !userId) {
    throw Error('Invalid token provided');
  }

  return { role, userId };
};


