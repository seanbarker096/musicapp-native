import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from 'app/login/Login';
import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthState, AuthStatus } from '../store/auth/auth.types';
import LoggedInAppShell from './app-shell/AppShell';
import { authenticateUserOnAppStartup } from './services/authService';
import SignUp from './signup/SignUp';

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator<ParamListBase>();

const App = function () {
  const [authState, setAuthState] = useState<undefined | AuthState>(undefined);
  // try {
  //   console.log('CLEARING SECURE STORAGE FOR DEV PURPOSES');
  //   SecureStore.deleteItemAsync('refresh_token');
  //   SecureStore.deleteItemAsync('access_token');
  // } catch (e) {}

  useEffect(() => {
    const _authenticateUserOnAppStartUp = async () => {
      try {
        const authState = await authenticateUserOnAppStartup();
        setAuthState(authState);
      } catch (e) {
        Promise.reject();
      }

      _authenticateUserOnAppStartUp();
    };
  }, []);

  const loggedOutPages = (
    <>
      <Stack.Screen
        name="Login"
        component={Login}
      ></Stack.Screen>
      <Stack.Screen
        name="SignUp"
        component={SignUp}
      ></Stack.Screen>
    </>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authState?.status === AuthStatus.AUTHENTICATED ? (
          <Stack.Screen name="LoggedInApp">
            {/* TODO: Make sure to use react memo here https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props*/}
            {props => (
              <LoggedInAppShell
                {...props}
                authState={authState}
              ></LoggedInAppShell>
            )}
          </Stack.Screen>
        ) : (
          loggedOutPages
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const WrappedApp = () => (
  <QueryClientProvider client={queryClient}>
    <App></App>
  </QueryClientProvider>
);

registerRootComponent(WrappedApp);
