import { SetLoggedOutPage } from 'app/App';
import { SignUpStackScreen } from 'app/signup/SignUpStackScreen';
import React, { FC } from 'react';
import { AuthState } from 'store/auth/auth.types';

type SignUpProps = {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  setLoggedOutPage: SetLoggedOutPage;
};

export const SignUpPageStateSettersContext = React.createContext<SignUpProps>({
  setAuthState: () => {},
  setLoggedOutPage: () => {},
});

export const SignUp: FC<SignUpProps> = ({ setAuthState, setLoggedOutPage }) => {
  return (
    <SignUpPageStateSettersContext.Provider
      value={{ setAuthState, setLoggedOutPage }}
    >
      <SignUpStackScreen></SignUpStackScreen>
    </SignUpPageStateSettersContext.Provider>
  );
};
