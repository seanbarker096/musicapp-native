import { AppText } from 'components/app-text';
import { List, ListItem } from 'components/list';
import { FC } from 'react';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';

type Props = {
  attendeeId?: number;
  performerId?: number;
};

export const PerformanceList: FC<Props> = ({ performerId, attendeeId }) => {
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
      {performances && (
        <List
          sidePadding="small"
          verticalPadding="none"
          scrollable={true}
        >
          {performances?.map(performance => (
            <ListItem>
              <AppText>Performer: {performance.performerId}</AppText>
              <AppText>Venue: {performance.venueId}</AppText>
            </ListItem>
          ))}
        </List>
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error...</AppText>}
    </>
  );
};
