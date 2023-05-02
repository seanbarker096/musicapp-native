import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePostStackScreen from 'app/create-post/CreatePostStackScreen';
import HomeStackScreen from 'app/home/HomeStackScreen';
import ManageStackScreen from 'app/manage/ManageStackScreen';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import ProfileStackScreen from 'app/profile/ProfileStackScreen';
import { SearchStackScreen } from 'app/search/SearchStackScreen';
import { useReauthenticateUserEffect } from 'app/services/authService';
import {
  ProfileContext,
  ProfileState,
  ProfileType,
} from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthState } from 'store/auth/auth.types';
import { APP_BACKGROUND_COLOR } from 'styles';
import { AppShellStackNavigatorParamList } from './appShell.types';

interface LoggedInAppShellProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}
const LoggedInAppShell: FC<LoggedInAppShellProps> = ({
  authState,
  setAuthState,
}) => {
  const [profileState, setProfileState] = useState<ProfileState>({
    profileType: ProfileType.USER,
    profileId: authState.authUser.userId,
  });

  useReauthenticateUserEffect({ authState, setAuthState });

  if (!authState) {
    console.warn('Logged in app shell initialised without an authState');
  }

  console.log('re-rendering app shell');

  return (
    <>
      {authState && (
        <AuthStateContext.Provider value={{ authState, setAuthState }}>
          <ProfileContext.Provider value={{ profileState, setProfileState }}>
            <LoggedInScreens></LoggedInScreens>
          </ProfileContext.Provider>
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
  /**
   In order to be able to hide the bottom tab navigator on certain primary screens (e.g. PrimaryScreens.CREATE_POST) we use a stack navigator here, and then csreate a new tab navigator for each primary screen. We then create a stack navigator internally for each primary screen so we can navigate back and forth between screens within that primary screen
   */
  const Stack = createNativeStackNavigator<AppShellStackNavigatorParamList>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: {
          backgroundColor: APP_BACKGROUND_COLOR,
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
        component={ProfileStackScreen}
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
