import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { TimelineStackParamList } from 'app/timeline/timeline-types';
import { FC } from 'react';
import { Performance } from './Performance';
import { PerformanceStackParamList } from './performance-types';

type PerformanceStackScreenProps =
  | NativeStackScreenProps<TimelineStackParamList, 'TimelinePerformance'>
  | NativeStackScreenProps<ProfileStackParamList, 'ProfilePerformance'>;

export const PerformanceStackScreen: FC<PerformanceStackScreenProps> = ({
  route: {
    params: { performanceId, performerId },
  },
}) => {
  const PerformanceStack =
    createNativeStackNavigator<PerformanceStackParamList>();

  return (
    <PerformanceStack.Navigator>
      <PerformanceStack.Screen
        name="Performance"
        component={Performance}
        initialParams={{ performanceId, performerId }}
      ></PerformanceStack.Screen>
    </PerformanceStack.Navigator>
  );
};
