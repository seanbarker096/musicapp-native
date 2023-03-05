import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStackScreen from 'app/home/HomeStackScreen';
import ManageStackScreen from 'app/manage/ManageStackScreen';
import CreatePostStackScreen from 'app/post/UploadStackScreen';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import SearchStackScreen from 'app/search/SearchStackScreen';
import UserProfileStackScreen from 'app/user-profile/UserProfileStackScreen';
import React, { FC } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthState } from 'store/auth/auth.types';
import { AppShellStackNavigatorParamList } from './appShell.types';

interface LoggedInAppShellProps {
  authState: AuthState;
}
const LoggedInAppShell: FC<LoggedInAppShellProps> = ({ authState }) => {
  if (!!authState) {
    //console.warn('Logged in app shell initialised without an authState');
  }

  return (
    <>
      {authState && (
        <AuthStateContext.Provider value={{ authState }}>
          <LoggedInScreens></LoggedInScreens>
        </AuthStateContext.Provider>
      )}
    </>
  );
};

export default LoggedInAppShell;

/**
 * This component exists to initialise Tab in seperate component to LoggedInApp shell. Because of the conditional rendering of the template the Tab Navigator was rendering at the top of the screen
 **/
const LoggedInScreens = () => {
  const Stack = createNativeStackNavigator<AppShellStackNavigatorParamList>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Stack.Screen
        name={PrimaryScreens.HOME}
        component={HomeStackScreen}
      ></Stack.Screen>
      <Stack.Screen
        component={SearchStackScreen}
        name={PrimaryScreens.SEARCH}
      ></Stack.Screen>
      <Stack.Screen
        component={UserProfileStackScreen}
        name={PrimaryScreens.PROFILE}
      ></Stack.Screen>
      <Stack.Screen
        component={ManageStackScreen}
        name={PrimaryScreens.MANAGE}
      ></Stack.Screen>
      <Stack.Screen
        component={CreatePostStackScreen}
        name={PrimaryScreens.CREATE_POST}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
