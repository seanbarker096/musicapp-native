import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from 'app/home/Home';
import ManageStackScreen from 'app/manage/ManageStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import SearchStackScreen from 'app/search/SearchStackScreen';
import UserProfileStackScreen from 'app/user-profile/UserProfileStackScreen';
import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthState } from 'store/auth/auth.types';

interface LoggedInAppShellProps {
  authState: AuthState;
}
const LoggedInAppShell: FC<LoggedInAppShellProps> = ({
  authState: authStateProp,
}) => {
  if (!!authStateProp) {
    console.warn('Logged in app shell initialised without an authState');
  }
  // create authContext to pass around the logged in app
  const [authState, setAuthState] = useState<AuthState>(authStateProp);

  const Tab = createBottomTabNavigator();

  return (
    <View>
      {authState && (
        <AuthStateContext.Provider value={{ authState, setAuthState }}>
          <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => (
              <PrimaryNav navigation={props.navigation}></PrimaryNav>
            )}
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
        </AuthStateContext.Provider>
      )}
    </View>
  );
};

export default LoggedInAppShell;
