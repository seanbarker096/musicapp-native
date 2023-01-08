import { AuthState, LoginResultApi, SignUpResultApi } from './auth.types';

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

export function signUpResultToAuthState(data: SignUpResultApi): AuthState {
  return {
    authUser: {
      userId: data.user_id,
      role: data.role,
      permissions: [],
    },
    status: data.auth_status,
  };
}
