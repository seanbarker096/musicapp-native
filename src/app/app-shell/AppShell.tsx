import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from 'app/home/Home';
import ManageStackScreen from 'app/manage/ManageStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import SearchStackScreen from 'app/search/SearchStackScreen';
import UserProfileStackScreen from 'app/user-profile/UserProfileStackScreen';
import React, { FC } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthState } from 'store/auth/auth.types';

interface LoggedInAppShellProps {
  authState: AuthState;
}
const LoggedInAppShell: FC<LoggedInAppShellProps> = ({ authState }) => {
  if (!!authState) {
    console.warn('Logged in app shell initialised without an authState');
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
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <PrimaryNav navigation={props.navigation}></PrimaryNav>}
    >
      <Tab.Screen
        name={PrimaryScreens.HOME}
        component={Home}
      ></Tab.Screen>
      <Tab.Screen
        name={PrimaryScreens.SEARCH}
        component={SearchStackScreen}
      ></Tab.Screen>
      <Tab.Screen
        name={PrimaryScreens.PROFILE}
        component={UserProfileStackScreen}
      />
      <Tab.Screen
        name={PrimaryScreens.MANAGE}
        component={ManageStackScreen}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};
