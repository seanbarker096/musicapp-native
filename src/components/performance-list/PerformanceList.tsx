import { AppEmptyState } from 'components/app-empty-state';
import { AppText } from 'components/app-text';
import { CreatePerformanceButton } from 'components/create-performance-button';
import { List, ListItem } from 'components/list';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { PerformanceListItem } from './PerformanceListItem';

type Props = {
  attendeeId?: number;
  performerId?: number;
  handleViewProfilePress?: () => void;
  handleCreatePerformancePress?: () => void;
  handlePerformancePress: (performance: PerformanceWithEvent) => void;
};

export const PerformanceList: FC<Props> = ({
  performerId,
  attendeeId,
  handleCreatePerformancePress = () => {},
  handleViewProfilePress,
  handlePerformancePress,
}) => {
  const { profileState } = useContext(ProfileContext);
  const {
    profileType: loggedInUserProfileType,
    profileId: loggedInUserProfileId,
  } = profileState;

  const loggedInUserIsThePerformer =
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

  return (
    <>
      {performances && !!performances.length && (
        <>
          {loggedInUserIsThePerformer && (
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

      {
        // if results arent filtered for a specific attendee (i.e. we are just fethcing all the performers performances, show empty state if there are no performances)
        !attendeeId && performances && !performances.length && (
          <>
            {!loggedInUserIsThePerformer && (
              <AppEmptyState
                primaryMessage="This artist hasn't created any performances yet"
                // If we provide a handleViewProfilePress, we are using this component on the profile page, so show a secondary message + action text. TODO: Create a wrapper component or something so this is clearer
                secondaryMessage={
                  handleViewProfilePress
                    ? 'Once they have, link your videos from the show so the artist can see them.'
                    : undefined
                }
                actionText={
                  handleViewProfilePress
                    ? 'View fan videos for this artist'
                    : undefined
                }
                onActionPress={handleViewProfilePress}
              ></AppEmptyState>
            )}
            {loggedInUserIsThePerformer && (
              <AppEmptyState
                primaryMessage="Your journey as an artist"
                secondaryMessage="Keep a record of your journey as an artist by creating a show. They'll appear here, along with any videos your fans have uploaded from these shows."
                actionText="Create a show"
                onActionPress={handleCreatePerformancePress}
              ></AppEmptyState>
            )}
          </>
        )
      }
      {attendeeId && performances && !performances.length && (
        <AppText>No performances found</AppText>
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
