import { createContext } from 'react';
import { AuthStatus } from './auth.types';

export const AuthContext = createContext({
  status: AuthStatus.UNAUTHENTICATED,
  setStatus: (status: AuthStatus): void => {},
});
