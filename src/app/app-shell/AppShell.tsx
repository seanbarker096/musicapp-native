import { useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStackScreen from 'app/home/HomeStackScreen';
import ManageStackScreen from 'app/manage/ManageStackScreen';
import CreatePostStackScreen from 'app/post/UploadStackScreen';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import SearchStackScreen from 'app/search/SearchStackScreen';
import UserProfileStackScreen from 'app/user-profile/UserProfileStackScreen';
import React, { FC, useState } from 'react';
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
  const [selectedScreen, setSelectedScreen] = useState<PrimaryScreens>(
    PrimaryScreens.HOME,
  );

  const route = useRoute();

  console.log('route', route);

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
      >
        {/* TODO: Make sure to use react memo here https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props*/}
      </Stack.Screen>
      <Stack.Screen name={PrimaryScreens.SEARCH}>
        {props => (
          <SearchStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></SearchStackScreen>
        )}
      </Stack.Screen>
      <Stack.Screen name={PrimaryScreens.PROFILE}>
        {props => (
          <UserProfileStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></UserProfileStackScreen>
        )}
      </Stack.Screen>
      <Stack.Screen name={PrimaryScreens.MANAGE}>
        {props => (
          <ManageStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></ManageStackScreen>
        )}
      </Stack.Screen>
      <Stack.Screen name={PrimaryScreens.CREATE_POST}>
        {props => (
          <CreatePostStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></CreatePostStackScreen>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
