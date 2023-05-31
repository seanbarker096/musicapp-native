import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { PerformanceList } from 'components/performance-list';
import { ProfileImage } from 'components/profile-image';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { useUserGetQuery } from 'store/users';
import { BUTTON_COLOR_PRIMARY, SPACING_SMALL } from 'styles';
import { TimelineStackParamList } from './timeline-types';

type TimelineProps = NativeStackScreenProps<TimelineStackParamList, 'Timeline'>;

/**
 * This component shows a timeline of performances a given user has attended
 *
 * TODO: Rename this component to something more descriptive e.g. UsersAttendedPerformances
 */
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

  const {
    data: users,
    isLoading: userLoading,
    error: usersGetError,
  } = useUserGetQuery({
    queryParams: {
      id: attendeeId,
    },
  });

  const user = users?.[0];
  const performer = performers?.[0];

  const loading = (!performer && performerLoading) || (!user && userLoading);
  const error = (!performer && performerGetError) || (!user && usersGetError);

  function navigateToArtistProfile() {
    navigation.navigate('ProfileStack', {
      profileId: performerId,
      profileType: ProfileType.PERFORMER,
    });
  }

  return (
    <>
      {performer && user && (
        <View style={{ ...styles.colContainer }}>
          <View style={{ ...styles.rowContainer }}>
            <ProfileImage
              size="large"
              imageUrl={performer.imageUrl}
            ></ProfileImage>
            <ProfileImage
              size="large"
              styles={{ marginLeft: -SPACING_SMALL }}
              imageUrl={user.avatarFile?.url}
            ></ProfileImage>
          </View>
          <AppText
            size="large"
            weight="bold"
          >
            {performer.name} & {user.firstName}
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
          <View style={{ alignSelf: 'flex-start' }}>
            <AppText>Shows attended by {user.firstName}</AppText>
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
  rowContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
