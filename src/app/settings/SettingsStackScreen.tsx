import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';

import Settings from './Settings';
import { SettingsStackParamList } from './settings.types';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStackScreen: FC<Props> = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen
        component={Settings}
        name="Settings"
      ></SettingsStack.Screen>
    </SettingsStack.Navigator>
  );
};

export default SettingsStackScreen;
