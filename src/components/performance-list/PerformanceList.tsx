import { AppButton } from 'components/app-button';
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
              <>
                <AppText>
                  {"This artist hasn't created any performances yet." +
                    (handleViewProfilePress
                      ? 'But you can still see lots of videos captured by fans!'
                      : '')}
                </AppText>
                {handleViewProfilePress && (
                  <Button
                    color={BUTTON_COLOR_PRIMARY}
                    onPress={handleViewProfilePress}
                    title="View fan videos"
                  />
                )}
              </>
            )}
            {loggedInUserIsThePerformer && (
              <>
                <AppText>
                  You haven't created any performances yet. Create performances
                  so that your fans can link their videos to them, making it
                  easy for you to see them all
                </AppText>
                <AppButton
                  color={BUTTON_COLOR_PRIMARY}
                  handlePress={handleCreatePerformancePress}
                  text="Create performance"
                />
              </>
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
