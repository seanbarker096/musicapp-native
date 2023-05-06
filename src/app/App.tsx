import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthState, AuthStatus } from '../store/auth/auth.types';
import LoggedInAppShell from './app-shell/AppShell';
import Login from './logged-out-pages/Login';
import SessionExpired from './logged-out-pages/SessionExpired';
import { SignUp } from './logged-out-pages/SignUp';
import { authenticateUserOnAppStartup } from './services/authService';

const queryClient = new QueryClient();

export enum LoggedOutPage {
  LOGIN = 'LOGIN',
  SIGN_UP = 'SIGN_UP',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export type SetLoggedOutPage = React.Dispatch<
  React.SetStateAction<LoggedOutPage | undefined>
>;

const App = function () {
  const [authState, setAuthState] = useState<undefined | AuthState>(undefined);
  // const [sessionExpired, setSessionExpired] = useState<boolean>(sessionExpired);
  const [loggedOutPage, setLoggedOutPage] = useState<LoggedOutPage | undefined>(
    LoggedOutPage.LOGIN,
  );

  // try {
  //   console.log('CLEARING SECURE STORAGE FOR DEV PURPOSES');
  //   SecureStore.deleteItemAsync('refresh_token');
  //   SecureStore.deleteItemAsync('access_token');
  // } catch (e) {}

  authenticateUserOnAppStartup(setAuthState);

  return (
    <NavigationContainer>
      {authState?.status === AuthStatus.AUTHENTICATED ? (
        <LoggedInAppShell
          authState={authState}
          setAuthState={
            setAuthState as React.Dispatch<React.SetStateAction<AuthState>> // we know authState is defined here, so can safely cast
          }
          setLoggedOutPage={setLoggedOutPage}
        ></LoggedInAppShell>
      ) : (
        <>
          {(!!loggedOutPage || loggedOutPage === LoggedOutPage.LOGIN) && (
            <Login
              setAuthState={setAuthState}
              setLoggedOutPage={setLoggedOutPage}
            ></Login>
          )}
          {loggedOutPage === LoggedOutPage.SIGN_UP && (
            <SignUp
              setAuthState={setAuthState}
              setLoggedOutPage={setLoggedOutPage}
            ></SignUp>
          )}
          {loggedOutPage === LoggedOutPage.SESSION_EXPIRED && (
            <SessionExpired
              setLoggedOutPage={setLoggedOutPage}
            ></SessionExpired>
          )}
        </>
      )}
    </NavigationContainer>
  );
};

const WrappedApp = () => (
  <QueryClientProvider client={queryClient}>
    <App></App>
  </QueryClientProvider>
);

registerRootComponent(WrappedApp);
