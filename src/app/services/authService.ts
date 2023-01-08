import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import { useContext, useEffect } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useAuthTokenCreateMutation } from 'store/auth/auth.queries';
import {
  AuthState,
  AuthStatus,
  AuthUser,
  AuthUserApi,
} from 'store/auth/auth.types';

export const reauthenticateUserOnAppStartup = (
  authState: AuthState | undefined,
) => {
  reAuthenticateUser(authState, []);
};

/**
 * Authenticates the user ASSUMING that a refresh token is already available. This is used to create a new acess token. If no refresh token is available please use authenticateUser.
 *
 * @param param0
 */
export const reAuthenticateUser = (
  authState: AuthState | undefined,
  dependecy: any[],
) => {
  const { setAuthState } = useContext(AuthStateContext);
  const mutation = useAuthTokenCreateMutation();

  useEffect(() => {
    const _reAuthenticateUser = async () => {
      if (authState && authState.status === AuthStatus.AUTHENTICATED) {
        return;
      }

      const refreshToken = await SecureStore.getItemAsync('refresh_token');

      if (!refreshToken) {
        throw Error(
          'Failed to find refresh token on users device. Cannot reauthenticate without a refresh token',
        );
      }

      try {
        await SecureStore.deleteItemAsync('access_token');
      } catch (e) {}

      const accessToken = await mutation.mutateAsync(refreshToken);

      await SecureStore.setItemAsync('access_token', accessToken);

      const newAuthUser = buildAuthUserFromAuthToken(accessToken);

      if (authState?.status === AuthStatus.AUTHENTICATED) {
        console.warn(
          'call made to authenticateUser despite user being authenticated already',
        );
      }

      setAuthState({
        authUser: newAuthUser,
        status: AuthStatus.AUTHENTICATED,
      });

      SecureStore.setItemAsync('access_token', accessToken);

      return authState;
    };

    _reAuthenticateUser();
  }, dependecy);
};

const buildAuthUserFromAuthToken = (token: string): AuthUser => {
  const { role, user_id: userId } = jwt_decode<AuthUserApi>(token);

  console.log(jwt_decode(token));

  if (!role || !userId) {
    throw Error('Invalid token provided');
  }

  return { role, userId };
};