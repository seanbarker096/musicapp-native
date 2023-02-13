import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import CreatePost from './CreatePost';
import { CreatePostStackParamList } from './post.types';

interface CreatePostStackScreenProps {}

const CreatePostStackNavigator =
  createNativeStackNavigator<CreatePostStackParamList>();

const CreatePostStackScreen: FC<CreatePostStackScreenProps> = () => {
  return (
    <CreatePostStackNavigator.Navigator>
      <CreatePostStackNavigator.Screen
        component={CreatePost}
        name="CreatePost"
      ></CreatePostStackNavigator.Screen>
    </CreatePostStackNavigator.Navigator>
  );
};

export default CreatePostStackScreen;
