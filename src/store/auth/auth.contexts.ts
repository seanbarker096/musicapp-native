import { createContext } from 'react';
import { AuthState } from './auth.types';

export interface AuthContext {
  authState?: AuthState;
  setAuthState: (authState: AuthState) => void;
}

export const AuthStateContext = createContext<AuthContext>({
  authState: undefined,
  setAuthState: () => {},
});
