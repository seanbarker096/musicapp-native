import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import Home from 'app/home/Home';
import ManageStackScreen from 'app/manage/ManageStackScreen';
import CreatePostStackScreen from 'app/post/UploadStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
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

  const Tab = createBottomTabNavigator<AppShellStackNavigatorParamList>();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={selectedScreen}
        ></PrimaryNav>
      )}
    >
      <Tab.Screen name={PrimaryScreens.HOME}>
        {/* TODO: Make sure to use react memo here https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props*/}
        {props => (
          <Home
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></Home>
        )}
      </Tab.Screen>
      <Tab.Screen name={PrimaryScreens.SEARCH}>
        {props => (
          <SearchStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></SearchStackScreen>
        )}
      </Tab.Screen>
      <Tab.Screen name={PrimaryScreens.PROFILE}>
        {props => (
          <UserProfileStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></UserProfileStackScreen>
        )}
      </Tab.Screen>
      <Tab.Screen name={PrimaryScreens.MANAGE}>
        {props => (
          <ManageStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></ManageStackScreen>
        )}
      </Tab.Screen>
      <Tab.Screen name={PrimaryScreens.CREATE_POST}>
        {props => (
          <CreatePostStackScreen
            {...props}
            setSelectedScreen={setSelectedScreen}
          ></CreatePostStackScreen>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
