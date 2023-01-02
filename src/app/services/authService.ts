import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import { useContext } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useGetAuthTokenMutation } from 'store/auth/auth.queries';
import { AuthStatus, AuthUser } from 'store/auth/auth.types';

export class AuthService {
  constructor() {
    console.log('AuthService initialised');
  }

  private async getAuthToken() {
    // Remove any previous auth token if it exists
    try {
      await SecureStore.deleteItemAsync('access_token');
    } catch (e) {}

    const refreshToken = await SecureStore.getItemAsync('refresh_token');

    if (!refreshToken) {
      throw Error(
        'Could not find refresh token on users device. Cannot get auth token without a refresh token',
      );
    }

    const mutation = useGetAuthTokenMutation();

    const accessToken = await mutation.mutateAsync(refreshToken);

    await SecureStore.setItemAsync('access_token', accessToken);

    return accessToken;
  }

  private buildAuthUserFromAuthToken(token: string): AuthUser {
    const { role, permissions, userId } = jwt_decode<AuthUser>(token);

    if (!role || !permissions || !userId) {
      throw Error('Invalid token provided');
    }

    return { role, permissions, userId };
  }

  async authenticateUser() {
    const token = await this.getAuthToken();

    const newAuthUser = this.buildAuthUserFromAuthToken(token);

    const { setAuthState, authState } = useContext(AuthStateContext);

    if (authState?.status === AuthStatus.AUTHENTICATED) {
      console.warn(
        'call made to authenticateUser despite user being authenticated already',
      );
    }

    setAuthState({
      authUser: newAuthUser,
      status: AuthStatus.AUTHENTICATED,
    });

    SecureStore.setItemAsync('access_token', token);
  }
}
