import { PerformanceList } from 'components/performance-list';
import { PerformerShowCountsList } from 'components/performer-show-count-list';
import { ProfileType } from 'contexts/profile.context';
import { FC } from 'react';

type Props = { profileId: number; profileType: ProfileType };

export const ProfileTimeline: FC<Props> = ({ profileId, profileType }) => {
  return (
    <>
      {profileType === ProfileType.PERFORMER && (
        <PerformanceList></PerformanceList>
      )}
      {profileType === ProfileType.USER && (
        <PerformerShowCountsList userId={profileId}></PerformerShowCountsList>
      )}
    </>
  );
};
