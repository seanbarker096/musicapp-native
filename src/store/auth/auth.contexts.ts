import { createContext } from 'react';
import { AuthState } from './auth.types';

export interface AuthStateContext {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
}

export const AuthStateContext = createContext<AuthStateContext>({
  /**
   * We need a default value but this will always be defined, as we initialise it inside logged in * components only
   */
  authState: undefined as unknown as AuthState,
  setAuthState: () => {},
});
