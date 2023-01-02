import { createContext } from 'react';
import { AuthState } from './auth.types';

export const AuthStateContext = createContext<{
  authState?: AuthState;
  setAuthState: (authState: AuthState) => void;
}>({
  authState: undefined,
  setAuthState: () => {},
});
