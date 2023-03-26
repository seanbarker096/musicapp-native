import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import Timeline from './Timeline';
import { TimelineStackParamList } from './timeline-types';

type Props = {};

export const TimelineStackScreen: FC<Props> = () => {
  const TimelineStack = createNativeStackNavigator<TimelineStackParamList>();

  return (
    <TimelineStack.Navigator>
      <TimelineStack.Screen
        name="timeline"
        component={Timeline}
      ></TimelineStack.Screen>
    </TimelineStack.Navigator>
  );
};
