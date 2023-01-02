import { AuthStatus, AuthUserRole } from 'store/auth/auth.types';

export interface ValidateAuthStateApi {
  user_id: number;
  auth_status: AuthStatus;
  role: AuthUserRole;
  token: string;
  r_token: string;
}
