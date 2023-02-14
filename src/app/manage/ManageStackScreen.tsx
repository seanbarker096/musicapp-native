import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import React, { FC, useCallback } from 'react';
import Manage from './Manage';

const ManageStackNavigator = createNativeStackNavigator();

type Props = BottomTabScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.MANAGE
> & {
  setSelectedScreen: (screen: PrimaryScreens) => void;
};

const ManageStackScreen: FC<Props> = ({ setSelectedScreen }) => {
  useFocusEffect(
    useCallback(() => {
      setSelectedScreen(PrimaryScreens.MANAGE);
    }, [setSelectedScreen]),
  );

  return (
    <ManageStackNavigator.Navigator>
      <ManageStackNavigator.Screen
        component={Manage}
        name="Manage"
      ></ManageStackNavigator.Screen>
    </ManageStackNavigator.Navigator>
  );
};

export default ManageStackScreen;
