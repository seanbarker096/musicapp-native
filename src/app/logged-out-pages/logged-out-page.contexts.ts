import React from 'react';
import { SignUpProps } from './SignUp';

export const SignUpPageStateSettersContext = React.createContext<SignUpProps>({
  setAuthState: () => {},
  setLoggedOutPage: () => {},
});
