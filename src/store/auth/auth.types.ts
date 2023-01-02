export enum AuthUserRole {
  USER = 1,
  ADMIN = 2,
}

export enum AuthStatus {
  AUTHENTICATED = 1,
  UNAUTHENTICATED = 2,
}

export interface AuthUser {
  role: AuthUserRole;
  userId: number;
  permissions?: readonly number[];
}

export type AuthState = { authUser: AuthUser; status: AuthStatus };

export interface ValidateAuthQueryState {
  refreshToken: string;
  authToken: string;
}

export interface LoginFormState {
  username: string;
  password: string;
}

export interface LoginResultApi {
  user_id: number;
  auth_status: AuthStatus;
  role: AuthUserRole;
  access_token: string;
  refresh_token: string;
}
