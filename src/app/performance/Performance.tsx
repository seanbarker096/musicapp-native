import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC } from 'react';
import { View } from 'react-native';
import { usePerformancesCountsGetQuery } from 'store/performances-counts';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { PerformanceStackParamList } from './performance-types';
import { PerformancePosts } from './PerformancePosts';

type PerformanceScreenProps = NativeStackScreenProps<
  PerformanceStackParamList,
  'Performance'
>;

export const Performance: FC<PerformanceScreenProps> = ({
  route: {
    params: { performanceId, performerId },
  },
}) => {
  const {
    data: performances,
    isLoading: performanceLoading,
    error: performanceGetError,
  } = usePerformancesCountsGetQuery({
    queryParams: {
      performanceIds: [performanceId],
      includeAttendeeCount: false,
      includeTagCount: true,
      includeFeaturesCount: true,
    },
  });

  const performance = performances?.[0];

  const {
    data: performers,
    isLoading: performerLoading,
    error: performerGetError,
  } = usePerformersGetQuery({
    queryParams: {
      id: performerId,
    },
  });

  const performer = performers?.[0];

  const loading =
    (!performance && performanceLoading) || (!performer && performerLoading);
  const error =
    (!performance && performanceGetError) || (!performer && performerGetError);

  return (
    <View>
      <PerformancePosts performanceId={performanceId}></PerformancePosts>
    </View>
  );
};
