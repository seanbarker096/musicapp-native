import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SetLoggedOutPage } from 'app/App';
import SignUpForm from 'app/signup/SignUpForm';
import { UploadProfileImage } from 'app/signup/UploadProfileImage';
import React, { FC } from 'react';
import { AuthState } from 'store/auth/auth.types';

type SignUpStackParamList = {
  SignUpForm: undefined;
  UploadProfileImage: undefined;
};

type SignUpProps = {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  setLoggedOutPage: SetLoggedOutPage;
};

const SignUpStack = createNativeStackNavigator<SignUpStackParamList>();

export const SignUpPageStateSettersContext = React.createContext<SignUpProps>({
  setAuthState: () => {},
  setLoggedOutPage: () => {},
});

export const SignUp: FC<SignUpProps> = ({ setAuthState, setLoggedOutPage }) => {
  return (
    <SignUpPageStateSettersContext.Provider
      value={{ setAuthState, setLoggedOutPage }}
    >
      <SignUpStack.Navigator>
        <SignUpStack.Screen
          name="SignUpForm"
          component={SignUpForm}
        ></SignUpStack.Screen>
        <SignUpStack.Screen
          name="UploadProfileImage"
          component={UploadProfileImage}
        ></SignUpStack.Screen>
      </SignUpStack.Navigator>
    </SignUpPageStateSettersContext.Provider>
  );
};
