import Login from 'app/login/Login';
import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useValidateAuthQuery } from '../store/auth/auth.queries';
import { AuthStatus } from '../store/auth/auth.types';

interface AuthContext {}

const { Provider } = createContext<AuthContext>({
  status: AuthStatus.UNAUTHENTICATED,
});

const queryClient = new QueryClient();

export default function App() {
  const [authStatus, setAuthStatus] = useState(AuthStatus.UNAUTHENTICATED);

  useEffect(() => {
    const getTokens = async () => {
      try {
        const authToken = await SecureStore.getItemAsync('auth_token');
        const refreshToken = await SecureStore.getItemAsync('refresh_token');

        if (authToken == null || refreshToken == null) {
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
          return;
        }
        // try to validate tokens with api
        useValidateAuthQuery({ authToken, refreshToken });
        // if valid update auth context
        setAuthStatus(AuthStatus.AUTHENTICATED);
      } catch (e) {
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      }
    };

    getTokens();
  }, []);

  const loggedInPages = (
    <Provider value={{ authStatus }}>
      {/* <AppShell></AppShell> */}
      <Text>You are logged in</Text>
    </Provider>
  );

  const loggedOutPages = <Login></Login>;

  return (
    <QueryClientProvider client={queryClient}>
      {authStatus === AuthStatus.AUTHENTICATED ? loggedInPages : loggedOutPages}
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

registerRootComponent(App);
