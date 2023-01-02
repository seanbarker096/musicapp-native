import { AuthState, LoginResultApi } from './auth.types';

export function loginResultToAuthState(data: LoginResultApi): AuthState {
  return {
    authUser: {
      userId: data.user_id,
      role: data.role,
      permissions: [],
    },
    status: data.auth_status,
  };
}
