import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppShellStackScreenProps } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { FC } from 'react';
import { View } from 'react-native';
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
