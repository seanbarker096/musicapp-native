import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import { useFonts } from 'expo-font';
import React, { useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { APP_BACKGROUND_COLOR, COLOR_PRIMARY } from 'styles';
import { AuthState, AuthStatus } from '../store/auth/auth.types';
import LoggedInAppShell from './app-shell/AppShell';
import { LoggedOutPage } from './app-types';
import Login from './logged-out-pages/Login';
import SessionExpired from './logged-out-pages/SessionExpired';
import { SignUp } from './logged-out-pages/SignUp';
import { authenticateUserOnAppStartup } from './services/authService';

import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 mins. This prevents the app from re-fetching data whenever a component using the query mounts (e.g. when switching back and forth between gallery and show tabs on the profile page)
    },
  },
});

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLOR_PRIMARY,
    background: APP_BACKGROUND_COLOR,
  },
};

const AppMain = function () {
  const [authState, setAuthState] = useState<undefined | AuthState>(undefined);
  const [loggedOutPage, setLoggedOutPage] = useState<LoggedOutPage | undefined>(
    LoggedOutPage.LOGIN,
  );

  const [fontsLoaded] = useFonts({
    Quicksand: require('../assets/fonts/Quicksand-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  authenticateUserOnAppStartup(setAuthState);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      onLayout={onLayoutRootView}
      style={{ height: '100%', width: '100%' }}
    >
      <NavigationContainer theme={MyTheme}>
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
            {(!loggedOutPage || loggedOutPage === LoggedOutPage.LOGIN) && (
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
    </View>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppMain></AppMain>
  </QueryClientProvider>
);

export default App;
