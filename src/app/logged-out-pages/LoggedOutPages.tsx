import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC, createContext } from 'react';
import { AuthState } from 'store/auth/auth.types';
import Login from './Login';
import SessionExpired from './SessionExpired';
import SignUp from './SignUp';

type LoggedOutPagesProps = {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  setSessionExpired: React.Dispatch<React.SetStateAction<boolean>>;
  sessionExpired: boolean;
};

export interface SessionExpiredContext {
  sessionExpired: boolean;
  setSessionExpired: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SessionExpiredContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {});

export const LoggedOutPagesSetAuthState = createContext<
  React.Dispatch<React.SetStateAction<AuthState | undefined>>
>(() => {});

const LoggedOutPagesStack =
  createNativeStackNavigator<LoggedOutPagesStackNavigatorParamList>();

const LoggedOutPages: FC<LoggedOutPagesProps> = ({
  setAuthState,
  setSessionExpired,
  sessionExpired,
}) => {
  return (
    <SessionExpiredContext.Provider value={setSessionExpired}>
      <LoggedOutPagesSetAuthState.Provider value={setAuthState}>
        <LoggedOutPagesStack.Navigator>
          {sessionExpired ? (
            <LoggedOutPagesStack.Screen
              name="SessionExpired"
              component={SessionExpired}
            ></LoggedOutPagesStack.Screen>
          ) : (
            <>
              <LoggedOutPagesStack.Screen
                name="Login"
                component={Login}
              ></LoggedOutPagesStack.Screen>
              <LoggedOutPagesStack.Screen
                name="SignUp"
                component={SignUp}
              ></LoggedOutPagesStack.Screen>
            </>
          )}
        </LoggedOutPagesStack.Navigator>
      </LoggedOutPagesSetAuthState.Provider>
    </SessionExpiredContext.Provider>
  );
};

export default LoggedOutPages;
