import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppShellStackScreenProps } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { FC } from 'react';
import { View } from 'react-native';
import { usePerformancesCountsGetQuery } from 'store/performances-counts';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { PerformancePosts } from './PerformancePosts';
import { PerformanceStackParamList } from './performance-types';

type PerformanceScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PerformanceStackParamList, 'Performance'>,
  AppShellStackScreenProps
>;

export const Performance: FC<PerformanceScreenProps> = ({
  route: {
    params: { performanceId, performerId },
  },
  navigation,
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
      <PerformancePosts
        performanceId={performanceId}
        performerId={performerId}
        handleCreatePostPress={() =>
          navigation.navigate(PrimaryScreens.CREATE_POST)
        }
      ></PerformancePosts>
    </View>
  );
};
