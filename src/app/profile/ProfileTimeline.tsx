import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PerformanceList } from 'components/performance-list';
import { PerformerShowCountsList } from 'components/performer-show-count-list';
import { ProfileType } from 'contexts/profile.context';
import { FC } from 'react';
import { ProfileStackParamList } from './profile.types';

type Props = {
  profileId: number;
  profileType: ProfileType;
  handleViewProfilePress: () => void;
  handleCreatePerformancePress: () => void;
};

export const ProfileTimeline: FC<Props> = ({
  profileId,
  profileType,
  handleCreatePerformancePress,
  handleViewProfilePress,
}) => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  return (
    <>
      {profileType === ProfileType.PERFORMER && (
        <PerformanceList
          performerId={profileId}
          handleCreatePerformancePress={handleCreatePerformancePress}
          handleViewProfilePress={handleViewProfilePress}
        ></PerformanceList>
      )}
      {profileType === ProfileType.USER && (
        <PerformerShowCountsList userId={profileId}></PerformerShowCountsList>
      )}
    </>
  );
};
