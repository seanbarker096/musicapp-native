import { ProfileType } from 'contexts/profile.context';

export type PerformanceStackParamList = {
  Performance: {
    performanceId: number;
    performerId: number;
  };
  ViewPost: {
    postId: number;
  };
  ViewPerformer: {
    profileId: number;
    profileType: ProfileType;
  };
};

export enum PerformancePostTabs {
  FEATURED = 'FEATURED',
  FAN_CAPTURES = 'FAN_CAPTURES',
}
