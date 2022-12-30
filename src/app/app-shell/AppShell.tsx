import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import UserProfile from 'app/user-profile/UserProfile';
import React, { FC } from 'react';

interface AppShellProps {}
const AppShell: FC<AppShellProps> = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      tabBar={props => <PrimaryNav navigation={props.navigation}></PrimaryNav>}
    >
      <Tab.Screen
        name={PrimaryScreens.PROFILE}
        component={UserProfile}
      />
    </Tab.Navigator>
  );
};

export default AppShell;
