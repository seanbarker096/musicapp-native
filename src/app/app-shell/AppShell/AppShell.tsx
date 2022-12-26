import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import PrimaryNav from '../../primary-nav/PrimaryNav/PrimaryNav';
import UserProfile from '../../user-profile/UserProfile/UserProfile';

interface AppShellProps {}

const Stack = createNativeStackNavigator();

const AppShell: FC<AppShellProps> = () => (
  <>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={UserProfile}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    <PrimaryNav></PrimaryNav>
  </>
);

export default AppShell;
