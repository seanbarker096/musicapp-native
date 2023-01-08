import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import Upload from './Upload';

const UploadStackNavigator = createNativeStackNavigator();

interface UploadStackScreenProps {}

const UploadStackScreen: FC<UploadStackScreenProps> = () => (
  <UploadStackNavigator.Navigator>
    <UploadStackNavigator.Screen
      component={Upload}
      name="Upload"
    ></UploadStackNavigator.Screen>
  </UploadStackNavigator.Navigator>
);

export default UploadStackScreen;
