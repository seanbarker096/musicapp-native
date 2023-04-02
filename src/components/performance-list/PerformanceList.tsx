import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { AppText } from 'components/app-text';
import { List, ListItem } from 'components/list';
import { FC } from 'react';
import {
  PerformanceWithCounts,
  usePerformancesCountsGetQuery,
} from 'store/performances-counts';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { PerformanceListItem } from './PerformanceListItem';

type Props = {
  attendeeId?: number;
  performerId?: number;
};

export const PerformanceList: FC<Props> = ({ performerId, attendeeId }) => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

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
      {performancesWithCounts && (
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
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error...</AppText>}
    </>
  );
};
