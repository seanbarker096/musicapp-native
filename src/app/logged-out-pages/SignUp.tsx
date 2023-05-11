import { SetLoggedOutPage } from 'app/app-types';
import { SignUpStackScreen } from 'app/signup/SignUpStackScreen';
import React, { FC } from 'react';
import { AuthState } from 'store/auth/auth.types';
import { SignUpPageStateSettersContext } from './logged-out-page.contexts';

export type SignUpProps = {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  setLoggedOutPage: SetLoggedOutPage;
};

export const SignUp: FC<SignUpProps> = ({ setAuthState, setLoggedOutPage }) => {
  return (
    <SignUpPageStateSettersContext.Provider
      value={{ setAuthState, setLoggedOutPage }}
    >
      <SignUpStackScreen></SignUpStackScreen>
    </SignUpPageStateSettersContext.Provider>
  );
};
