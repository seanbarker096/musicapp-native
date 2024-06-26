import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { PostStackParamList } from 'app/post/post.types';
import { PostStackScreen } from 'app/post/PostStackScreen';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { ProfileInternalStackScreen } from 'app/profile/ProfileStackScreen';
import { TimelineStackParamList } from 'app/timeline/timeline-types';
import { FC } from 'react';
import { navHeaderFactory } from 'utils/utils';
import { Performance } from './Performance';
import { PerformanceStackParamList } from './performance-types';

type PerformanceStackScreenProps =
  | NativeStackScreenProps<TimelineStackParamList, 'PerformanceStack'>
  | NativeStackScreenProps<ProfileStackParamList, 'PerformanceStack'>
  | NativeStackScreenProps<PostStackParamList, 'PerformanceStack'>;

export const PerformanceStackScreen: FC<PerformanceStackScreenProps> = ({
  route: {
    params: { performanceId, performerId },
  },
}) => {
  const PerformanceStack =
    createNativeStackNavigator<PerformanceStackParamList>();

  return (
    <PerformanceStack.Navigator screenOptions={navHeaderFactory()}>
      <PerformanceStack.Screen
        name="Performance"
        component={Performance}
        initialParams={{ performanceId, performerId }}
        options={{ headerTitle: 'Gig' }}
      ></PerformanceStack.Screen>
      <PerformanceStack.Screen
        name="ViewPost"
        component={PostStackScreen}
        options={{ headerShown: false }}
      ></PerformanceStack.Screen>
      <PerformanceStack.Screen
        name="ViewPerformer"
        component={ProfileInternalStackScreen}
        options={{ headerShown: false }}
      ></PerformanceStack.Screen>
    </PerformanceStack.Navigator>
  );
};
