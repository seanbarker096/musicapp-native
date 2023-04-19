import { PerformanceList } from 'components/performance-list';
import { PerformerShowCountsList } from 'components/performer-show-count-list';
import { ProfileType } from 'contexts/profile.context';
import { FC } from 'react';

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
