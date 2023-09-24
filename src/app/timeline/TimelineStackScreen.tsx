import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { PerformanceStackScreen } from 'app/performance/PerformanceStackScreen';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { ProfileInternalStackScreen } from 'app/profile/ProfileStackScreen';
import { FC } from 'react';
import { navHeaderFactory } from 'utils/utils';
import Timeline from './Timeline';
import { TimelineStackParamList } from './timeline-types';

type TimelineStackScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'TimelineStack'
>;

/**
 * Used to view a list of performances a user has attended for a given artist. This is accessed from the users profile
 */
export const TimelineStackScreen: FC<TimelineStackScreenProps> = ({
  route: {
    params: { attendeeId, performerId },
  },
}) => {
  const TimelineStack = createNativeStackNavigator<TimelineStackParamList>();

  return (
    <TimelineStack.Navigator screenOptions={navHeaderFactory()}>
      <TimelineStack.Screen
        name="Timeline"
        initialParams={{ attendeeId, performerId }}
        component={Timeline}
      ></TimelineStack.Screen>
      <TimelineStack.Screen
        name="PerformanceStack"
        component={PerformanceStackScreen}
        options={{ headerShown: false }}
      ></TimelineStack.Screen>
      <TimelineStack.Screen
        name="ProfileStack"
        component={ProfileInternalStackScreen}
        options={{ headerShown: false }}
      ></TimelineStack.Screen>
    </TimelineStack.Navigator>
  );
};
