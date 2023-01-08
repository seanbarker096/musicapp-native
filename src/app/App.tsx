import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from 'app/login/Login';
import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import React, { useContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthStatus } from '../store/auth/auth.types';
import LoggedInAppShell from './app-shell/AppShell';
import AppContexts from './AppContexts';
import { reauthenticateUserOnAppStartup } from './services/authService';
import SignUp from './signup/SignUp';

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator<ParamListBase>();

const App = function () {
  // try {
  //   console.log('CLEARING SECURE STORAGE FOR DEV PURPOSES');
  //   SecureStore.deleteItemAsync('refresh_token');
  //   SecureStore.deleteItemAsync('access_token');
  // } catch (e) {}

  const { authState } = useContext(AuthStateContext);

  reauthenticateUserOnAppStartup(authState);

  const loggedInPages = (
    <Stack.Screen
      name="LoggedInApp"
      component={LoggedInAppShell}
    ></Stack.Screen>
  );

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
        {authState?.status === AuthStatus.AUTHENTICATED
          ? loggedInPages
          : loggedOutPages}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const WrappedApp = () => (
  <QueryClientProvider client={queryClient}>
    <AppContexts>
      <App></App>
    </AppContexts>
  </QueryClientProvider>
);

registerRootComponent(WrappedApp);
