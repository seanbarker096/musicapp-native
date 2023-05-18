import { ProfileType } from 'contexts/profile.context';

export type PostStackParamList = {
  Post: {
    postId: number;
  };
  PostLinkToPerformance: {
    postId: number;
    performerId: number;
  };
  PostCreatePerformance: undefined;
  PerformanceStack: {
    performanceId: number;
    performerId: number;
  };
  ProfileStack: {
    profileId: number;
    profileType: ProfileType;
  };
};
