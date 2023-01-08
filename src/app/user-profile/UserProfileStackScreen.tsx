import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import UserProfile from './UserProfile';

const UserProfileStack = createNativeStackNavigator();
interface UserProfileStackScreenProps {}

const UserProfileStackScreen: FC<UserProfileStackScreenProps> = () => (
  <UserProfileStack.Navigator>
    <UserProfileStack.Screen
      name="UserProfile"
      component={UserProfile}
    ></UserProfileStack.Screen>
  </UserProfileStack.Navigator>
);

export default UserProfileStackScreen;
