import { createContext } from 'react';
import { AuthService } from './authService';

export interface ServicesContext {
  authService: typeof AuthService;
}
export const AppServicesContext = createContext<ServicesContext>({
  authService: AuthService,
});
