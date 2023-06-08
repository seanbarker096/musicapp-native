import { PerformanceList } from 'components/performance-list';
import { PerformerShowCountsList } from 'components/performer-show-count-list';
import { ProfileType } from 'contexts/profile.context';
import { FC } from 'react';
import { PerformanceWithEvent } from 'store/performances/performances.types';

type Props = {
  profileId: number;
  profileType: ProfileType;
  handleViewProfilePress: () => void;
  handleCreatePerformancePress: () => void;
  handlePerformancePress: (performance: PerformanceWithEvent) => void;
  handleUploadPostPress: () => void;
};

export const ProfileTimeline: FC<Props> = ({
  profileId,
  profileType,
  handleCreatePerformancePress,
  handlePerformancePress,
  handleViewProfilePress,
  handleUploadPostPress,
}) => {
  return (
    <>
      {profileType === ProfileType.PERFORMER && (
        <PerformanceList
          performerId={profileId}
          handleCreatePerformancePress={handleCreatePerformancePress}
          handleViewProfilePress={handleViewProfilePress}
          handlePerformancePress={handlePerformancePress}
        ></PerformanceList>
      )}
      {profileType === ProfileType.USER && (
        <PerformerShowCountsList
          userId={profileId}
          handleUploadPostPress={handleUploadPostPress}
        ></PerformerShowCountsList>
      )}
    </>
  );
};
