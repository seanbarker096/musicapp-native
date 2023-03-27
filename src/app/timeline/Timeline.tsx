import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { View } from 'react-native';

interface TimelineProps {
  performerId: number;
  attendeeId: number;
}

const Timeline: FC<TimelineProps> = ({ performerId, attendeeId }) => (
  <View>
    <AppText>{performerId}</AppText>
    <AppText>{attendeeId}</AppText>
  </View>
);

export default Timeline;
