export enum AuthStatus {
  AUTHENTICATED = 0,
  UNAUTHENTICATED = 1,
}

export interface AuthUser {
  status: AuthStatus;
  userId: number;
}

export interface ValidateAuthQueryState {
  refreshToken: string;
  authToken: string;
}

export interface LoginFormState {
  username: string;
  password: string;
}
