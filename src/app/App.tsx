import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from 'app/login/Login';
import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthContext } from '../store/auth/auth.contexts';
import { useValidateAuthQuery } from '../store/auth/auth.queries';
import { AuthStatus } from '../store/auth/auth.types';

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator<ParamListBase>();

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

  const Temp = () => <Text>You are logged in</Text>;

  const loggedInPages = (
    <Stack.Screen
      name="Temp"
      component={Temp}
    ></Stack.Screen>
  );

  const loggedOutPages = (
    <Stack.Screen
      name="Login"
      component={Login}
    ></Stack.Screen>
  );

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{ status: authStatus, setStatus: setAuthStatus }}
        >
          <Stack.Navigator>
            {authStatus === AuthStatus.AUTHENTICATED
              ? loggedInPages
              : loggedOutPages}
          </Stack.Navigator>
        </AuthContext.Provider>
      </QueryClientProvider>
    </NavigationContainer>
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
