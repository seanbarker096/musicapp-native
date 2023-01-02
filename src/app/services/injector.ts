import { createContext } from 'react';
import { AuthService } from './authService';

export interface ServicesContext {
  authService: AuthService;
}
export const AppServicesContext = createContext<ServicesContext>({
  authService: new AuthService(),
});
