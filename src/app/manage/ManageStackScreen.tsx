import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import Manage from './Manage';

const ManageStackNavigator = createNativeStackNavigator();

interface ManageStackScreenProps {}

const ManageStackScreen: FC<ManageStackScreenProps> = () => (
  <ManageStackNavigator.Navigator>
    <ManageStackNavigator.Screen
      component={Manage}
      name="Manage"
    ></ManageStackNavigator.Screen>
  </ManageStackNavigator.Navigator>
);

export default ManageStackScreen;
