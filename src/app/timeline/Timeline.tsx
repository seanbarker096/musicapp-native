import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { View } from 'react-native';

interface TimelineProps {}

const Timeline: FC<TimelineProps> = () => (
  <View>
    <AppText>Timeline</AppText>
  </View>
);

export default Timeline;
