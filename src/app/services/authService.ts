import { ProfileState, ProfileType } from 'contexts/profile.context';
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
  setProfileState: Dispatch<SetStateAction<ProfileState | undefined>>,
) {
  const { mutateAsync } = useAuthTokenCreateMutation();

  useEffect(() => {
    const _authenticateUser = async () => {
      if (Platform.OS === 'web') {
        return;
      }
      const refreshToken = await SecureStore.getItemAsync('refresh_token');

      if (!refreshToken) {
        return;
      }

      try {
        await SecureStore.deleteItemAsync('access_token');
      } catch (e) {}

      try {
        const accessToken = await mutateAsync(refreshToken);

        await SecureStore.setItemAsync('access_token', accessToken);

        const authUser = buildAuthUserFromAuthToken(accessToken);

        SecureStore.setItemAsync('access_token', accessToken);

        setAuthState({ status: AuthStatus.AUTHENTICATED, authUser });

        // Default to user profile on login
        setProfileState({
          profileId: authUser.userId,
          profileType: ProfileType.USER,
        });
      } catch (e) {}
    };
    _authenticateUser();
  }, []);
}

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
