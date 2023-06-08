import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { AppText } from 'components/app-text';
import { List, ListItem } from 'components/list';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import {
  AttendeePerformer,
  useAttendeePerformersGetQuery,
} from 'store/attendee-performers';
import { PerformerShowCountsListItem } from './PerformerShowCountListItem';

interface Props {
  userId: number;
}

export const PerformerShowCountsList: FC<Props> = ({ userId }) => {
  const { profileState } = useContext(ProfileContext);

  const isViewingUser =
    profileState.profileType === ProfileType.USER &&
    profileState.profileId === userId;

  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const {
    data: performers,
    isLoading: performersLoading,
    error: performersGetError,
  } = useAttendeePerformersGetQuery({ attendeeId: userId });

  const loading = !performers && performersLoading;

  const error = !performers && performersGetError;

  function handleListItemPress(performer: AttendeePerformer) {
    navigation.navigate('TimelineStack', {
      attendeeId: performer.attendeeId,
      performerId: performer.id,
    });
  }

  return (
    <>
      {performers && !!performers.length && (
        <List
          sidePadding="xxxsmall"
          verticalPadding="xxxsmall"
          scrollable={true}
        >
          {performers?.map(performer => (
            <ListItem key={performer.id}>
              <PerformerShowCountsListItem
                handlePress={() => handleListItemPress(performer)}
                performer={performer}
                showCount={performer.count}
              ></PerformerShowCountsListItem>
            </ListItem>
          ))}
        </List>
      )}
      {performers && !performers.length && <AppText>No shows attended</AppText>}
      {performers && !performers.length && isViewingUser && (
        <AppText>
          Performances appear here once you create posts and tag them in the
          artists performances
        </AppText>
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error...</AppText>}
    </>
  );
};
