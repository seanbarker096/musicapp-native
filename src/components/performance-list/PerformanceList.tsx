import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { BorderedPlusSVG } from 'components/icon/svg-components';
import { List, ListItem } from 'components/list';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import { Button, Pressable, StyleSheet } from 'react-native';
import {
  PerformanceWithCounts,
  usePerformancesCountsGetQuery,
} from 'store/performances-counts';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { BUTTON_COLOR_PRIMARY, SPACING_XSMALL } from 'styles';
import { PerformanceListItem } from './PerformanceListItem';

type Props = {
  attendeeId?: number;
  performerId?: number;
  handleViewProfilePress?: () => void;
  handleCreatePerformancePress?: () => void;
};

export const PerformanceList: FC<Props> = ({
  performerId,
  attendeeId,
  handleCreatePerformancePress = () => {},
  handleViewProfilePress = () => {},
}) => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const { profileState } = useContext(ProfileContext);
  const {
    profileType: loggedInUserProfileType,
    profileId: loggedInUserProfileId,
  } = profileState;

  const loggedInUserIsPerformer =
    performerId === loggedInUserProfileId &&
    loggedInUserProfileType === ProfileType.PERFORMER;

  const {
    data: performances,
    isLoading: performancesLoading,
    error: performancesGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      attendeeId,
      performerId,
    },
  });

  const {
    data: performancesWithCounts,
    isLoading: performancesWithCountsLoading,
    error: performancesWithCountsGetError,
  } = usePerformancesCountsGetQuery({
    queryParams: {
      performanceIds: performances?.map(performance => performance.id),
      includeAttendeeCount: false,
      includeTagCount: true,
      includeFeaturesCount: true,
    },
    enabled: !!performances,
  });

  const loading =
    (!performances || !performancesWithCounts) &&
    (performancesLoading || performancesWithCountsLoading);

  const error =
    (!performances || !performancesWithCounts) &&
    (performancesGetError || performancesWithCountsGetError);

  function handlePerformancePress(
    performanceWithCounts: PerformanceWithCounts,
  ) {
    console.log('pressed');
    navigation.navigate('ProfilePerformance', {
      performanceId: performanceWithCounts.id,
      performerId: performanceWithCounts.performerId,
    });
  }
  return (
    <>
      {performancesWithCounts && performancesWithCounts.length && (
        <>
          {loggedInUserIsPerformer && (
            <Pressable
              onPress={() => handleCreatePerformancePress()}
              style={styles.columnContainer}
            >
              <SVGIcon styles={{ marginRight: SPACING_XSMALL }}>
                <BorderedPlusSVG></BorderedPlusSVG>
              </SVGIcon>
              <AppText>Create performance</AppText>
            </Pressable>
          )}

          <List
            sidePadding="small"
            verticalPadding="small"
            scrollable={true}
          >
            {performancesWithCounts?.map(performanceWithCounts => (
              <ListItem key={performanceWithCounts.id}>
                <PerformanceListItem
                  onListItemPress={handlePerformancePress}
                  performanceWithCounts={performanceWithCounts}
                ></PerformanceListItem>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {performancesWithCounts && !performancesWithCounts.length && (
        <>
          {!loggedInUserIsPerformer && (
            <>
              <AppText>
                This artist hasn't created any performances yet. But you can
                still see lots of videos captured by fans!
              </AppText>
              <Button
                color={BUTTON_COLOR_PRIMARY}
                onPress={handleViewProfilePress}
                title="View fan videos"
              />
            </>
          )}
          {loggedInUserIsPerformer && (
            <>
              <AppText>You haven't created any performances yet</AppText>
              <Button
                color={BUTTON_COLOR_PRIMARY}
                onPress={handleCreatePerformancePress}
                title="Create performance"
              />
            </>
          )}
        </>
      )}

      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error...</AppText>}
    </>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
});