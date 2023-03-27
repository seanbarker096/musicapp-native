import { AppText } from 'components/app-text';
import { List, ListItem } from 'components/list';
import { FC } from 'react';
import { useAttendeePerformersGetQuery } from 'store/attendee-performers';
import { PerformerShowCountsListItem } from './PerformerShowCountListItem';

interface Props {
  userId: number;
}

export const PerformerShowCountsList: FC<Props> = ({ userId }) => {
  const {
    data: performers,
    isLoading: performersLoading,
    error: performersGetError,
  } = useAttendeePerformersGetQuery({ attendeeId: userId });

  const loading = !performers && performersLoading;

  const error = !performers && performersGetError;

  return (
    <>
      {performers && (
        <List
          sidePadding="medium"
          verticalPadding="small"
          scrollable={true}
        >
          {performers?.map(performer => (
            <ListItem key={performer.id}>
              <PerformerShowCountsListItem
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
