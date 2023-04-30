import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { AppText } from 'components/app-text';
import { CreatePerformanceButton } from 'components/create-performance-button';
import { List, ListItem } from 'components/list';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import { Button, StyleSheet } from 'react-native';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { BUTTON_COLOR_PRIMARY } from 'styles';
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

  const loading = !performances && performancesLoading;

  const error = !performances && performancesGetError;

  function handlePerformancePress(performanceWithCounts: PerformanceWithEvent) {
    navigation.navigate('PerformanceStack', {
      performanceId: performanceWithCounts.id,
      performerId: performanceWithCounts.performerId,
    });
  }
  return (
    <>
      {performances && performances.length && (
        <>
          {loggedInUserIsPerformer && (
            <CreatePerformanceButton
              onPress={handleCreatePerformancePress}
            ></CreatePerformanceButton>
          )}

          <List
            sidePadding="xxxsmall"
            verticalPadding="xxxsmall"
            scrollable={true}
          >
            {performances?.map(performances => (
              <ListItem key={performances.id}>
                <PerformanceListItem
                  onListItemPress={handlePerformancePress}
                  performances={performances}
                ></PerformanceListItem>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {performances && !performances.length && (
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
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});