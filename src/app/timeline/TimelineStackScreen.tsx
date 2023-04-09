import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { FC } from 'react';
import Timeline from './Timeline';
import { TimelineStackParamList } from './timeline-types';

type TimelineStackScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'ProfileTimeline'
>;

export const TimelineStackScreen: FC<TimelineStackScreenProps> = ({
  route: {
    params: { attendeeId, performerId },
  },
}) => {
  const TimelineStack = createNativeStackNavigator<TimelineStackParamList>();

  return (
    <TimelineStack.Navigator>
      <TimelineStack.Screen name="Timeline">
        {props => (
          <Timeline
            {...props}
            attendeeId={attendeeId}
            performerId={performerId}
          ></Timeline>
        )}
      </TimelineStack.Screen>
      {/* <TimelineStack.Screen
        name="TimelinePerformance"
        // @ts-ignore Currently we can't type check screens inside a navigator if that screen is used in multiple navigators (https://github.com/react-navigation/react-navigation/issues/11028)
        component={PerformanceStackScreen}
      ></TimelineStack.Screen> */}
    </TimelineStack.Navigator>
  );
};
