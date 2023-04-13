import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { AppText } from 'components/app-text';
import { List, ListItem } from 'components/list';
import { FC } from 'react';
import {
  AttendeePerformer,
  useAttendeePerformersGetQuery,
} from 'store/attendee-performers';
import { PerformerShowCountsListItem } from './PerformerShowCountListItem';

interface Props {
  userId: number;
}

export const PerformerShowCountsList: FC<Props> = ({ userId }) => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const {
    data: performers,
    isLoading: performersLoading,
    error: performersGetError,
  } = useAttendeePerformersGetQuery({ attendeeId: userId });

  const loading = !performers && performersLoading;

  const error = !performers && performersGetError;

  function handleListItemPress(performer: AttendeePerformer) {
    navigation.navigate('ProfileTimeline', {
      attendeeId: performer.attendeeId,
      performerId: performer.id,
    });
  }

  return (
    <>
      {performers && (
        <List
          sidePadding="xsmall"
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
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error...</AppText>}
    </>
  );
};
