import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from 'app/login/Login';
import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import React, { useContext } from 'react';
import { Text } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthStatus } from '../store/auth/auth.types';
import AppContexts from './AppContexts';
import { AppServicesContext } from './services/injector';

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator<ParamListBase>();

const App = function () {
  const { authService } = useContext(AppServicesContext);
  const { authState } = useContext(AuthStateContext);
  // try to get new access token in order to avoid user having to login, and update authContext
  try {
    authService.authenticateUser();
  } catch (e) {
    console.log(e);
  }

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
        <Stack.Navigator>
          {authState?.status === AuthStatus.AUTHENTICATED
            ? loggedInPages
            : loggedOutPages}
        </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

const WrappedApp = () => (
  <AppContexts>
    <App></App>
  </AppContexts>
);

registerRootComponent(WrappedApp);
