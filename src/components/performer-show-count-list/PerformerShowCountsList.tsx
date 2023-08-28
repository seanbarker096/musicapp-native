import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { AppEmptyState } from 'components/app-empty-state';
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
  handleUploadPostPress: () => void;
}

export const PerformerShowCountsList: FC<Props> = ({
  userId,
  handleUploadPostPress,
}) => {
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
      {performers && !performers.length && !isViewingUser && (
        <AppEmptyState
          primaryMessage="This user hasn't attended any gigs"
          secondaryMessage="Upload a video from a gig you've attended, and it will appear on your timeline"
        ></AppEmptyState>
      )}
      {performers && !performers.length && isViewingUser && (
        <AppEmptyState
          primaryMessage="Your journey as a music fan"
          secondaryMessage="Add gigs to your timeline by uploading videos you've taken at them. Link them to a gig and they'll appear here"
          onActionPress={handleUploadPostPress}
          actionText="Upload a video"
        ></AppEmptyState>
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error...</AppText>}
    </>
  );
};
