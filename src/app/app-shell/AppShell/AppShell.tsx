import { NavigationContainer } from '@react-navigation/native';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import React, { FC } from 'react';

interface AppShellProps {}
const AppShell: FC<AppShellProps> = () => (
  <NavigationContainer>
    <PrimaryNav></PrimaryNav>
  </NavigationContainer>
);

export default AppShell;
