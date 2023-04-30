import { ProfileType } from 'contexts/profile.context';

export type TimelineStackParamList = {
  Timeline: {
    attendeeId: number;
    performerId: number;
  };
  PerformanceStack: {
    performanceId: number;
    performerId: number;
  };
  ProfileStack: {
    profileId: number;
    profileType: ProfileType;
  };
};
