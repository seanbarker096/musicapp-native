import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import CreatePeformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
import { ManageStackParamList } from 'app/manage/manage-types';
import { PerformanceStackParamList } from 'app/performance/performance-types';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { FC } from 'react';
import { LinkPostToPerformance } from './LinkPostToPerformance';
import { Post } from './Post';
import { PostStackParamList } from './post.types';

type PostStackScreenProps =
  | NativeStackScreenProps<PerformanceStackParamList, 'ViewPost'>
  | NativeStackScreenProps<ProfileStackParamList, 'ViewPost'>
  | NativeStackScreenProps<ManageStackParamList, 'ViewPost'>;

export const PostStackScreen: FC<PostStackScreenProps> = ({
  route: {
    params: { postId },
  },
}) => {
  const PostStack = createNativeStackNavigator<PostStackParamList>();

  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="Post"
        component={Post}
        initialParams={{ postId }}
      ></PostStack.Screen>
      <PostStack.Screen
        name="PostLinkToPerformance"
        component={LinkPostToPerformance}
      ></PostStack.Screen>
      <PostStack.Screen
        name="PostCreatePerformance"
        component={CreatePeformanceStackScreen}
      ></PostStack.Screen>
    </PostStack.Navigator>
  );
};
