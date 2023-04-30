import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { PerformanceList } from 'components/performance-list';
import { ProfileImage } from 'components/profile-image';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { BUTTON_COLOR_PRIMARY } from 'styles';
import { TimelineStackParamList } from './timeline-types';

type TimelineProps = NativeStackScreenProps<TimelineStackParamList, 'Timeline'>;

const Timeline: FC<TimelineProps> = ({
  navigation,
  route: {
    params: { performerId, attendeeId },
  },
}) => {
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

  function navigateToArtistProfile() {
    navigation.navigate('ProfileStack', {
      profileId: performerId,
      profileType: ProfileType.PERFORMER,
    });
  }

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
          <View
            style={{
              flexGrow: 1,
              flexShrink: 0,
            }}
          >
            <Button
              color={BUTTON_COLOR_PRIMARY}
              onPress={navigateToArtistProfile}
              title={`View more of ${performer.name}'s shows`}
            ></Button>
          </View>

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
