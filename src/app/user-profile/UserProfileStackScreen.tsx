import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Post as PostComponent } from 'app/post/Post';
import React, { FC } from 'react';
import { Post } from '../../store/posts/index';
import UserProfile from './UserProfile';

export type UserProfileStackScreenProps = {
  Post: {
    post: Post;
  };
  UserProfile: undefined;
};

const UserProfileStack =
  createNativeStackNavigator<UserProfileStackScreenProps>();

const UserProfileStackScreen: FC<UserProfileStackScreenProps> = () => (
  <UserProfileStack.Navigator
    screenOptions={{
      contentStyle: {
        backgroundColor: '#FFFFFF',
      },
    }}
  >
    <UserProfileStack.Screen
      name="UserProfile"
      component={UserProfile}
    ></UserProfileStack.Screen>
    <UserProfileStack.Screen
      name="Post"
      component={PostComponent}
    ></UserProfileStack.Screen>
  </UserProfileStack.Navigator>
);

export default UserProfileStackScreen;
