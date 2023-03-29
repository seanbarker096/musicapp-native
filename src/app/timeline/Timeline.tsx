import { AppText } from 'components/app-text';
import { PerformanceList } from 'components/performance-list';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { usePerformersGetQuery } from 'store/performers/performers.queries';

interface TimelineProps {
  performerId: number;
  attendeeId: number;
}

const Timeline: FC<TimelineProps> = ({ performerId, attendeeId }) => {
  const {
    data: performers,
    isLoading: performerLoading,
    error: performerGetError,
  } = usePerformersGetQuery({
    queryParams: {
      id: performerId,
    },
  });

  const performer = performers?.[0];
  const loading = !performer && performerLoading;
  const error = !performer && performerGetError;

  return (
    <>
      {performer && (
        <View style={{ ...styles.colContainer }}>
          <ProfileImage imageUrl={performer.imageUrl}></ProfileImage>
          <AppText
            size="large"
            weight="bold"
          >
            {performer.name}
          </AppText>

          <PerformanceList
            performerId={performerId}
            attendeeId={attendeeId}
          ></PerformanceList>
        </View>
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error</AppText>}
    </>
  );
};

export default Timeline;

const styles = StyleSheet.create({
  colContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});
