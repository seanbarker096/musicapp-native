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
    <TimelineStack.Navigator screenOptions={{ headerShown: false }}>
      <TimelineStack.Screen name="timeline">
        {props => (
          <Timeline
            {...props}
            attendeeId={attendeeId}
            performerId={performerId}
          ></Timeline>
        )}
      </TimelineStack.Screen>
    </TimelineStack.Navigator>
  );
};
