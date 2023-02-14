import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC, useCallback } from 'react';
import { Text } from 'react-native';

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.HOME
> & {
  setSelectedScreen: (screen: PrimaryScreens) => void;
};

const Home: FC<Props> = ({ setSelectedScreen }) => {
  useFocusEffect(
    useCallback(() => {
      setSelectedScreen(PrimaryScreens.HOME);
    }, [setSelectedScreen]),
  );
  return <Text>Home Component</Text>;
};

export default Home;
