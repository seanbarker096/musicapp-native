import { ProfileType } from 'contexts/profile.context';

export type ProfileStackParamList = {
  Profile: {};
  ViewPost: {
    postId: number;
  };
  TimelineStack: {
    attendeeId: number;
    performerId: number;
  };
  // Clicking a performance from their profile timeline will take us to a new screen for that performance
  PerformanceStack: {
    performanceId: number;
    performerId: number;
  };
  ProfileCreatePerformance: undefined;
  ProfileSettings: undefined;
};

/**
 * ProfileInternalStackScreen is reused by multiple navigators of various types (bottom tab, stack, etc.). Currently we can't type screens which are reused by multiple navigators. Hence we define this type to at least provide some type safety.
 */
export interface ProfileInternalStackScreenParams {
  profileId: number;
  profileType: ProfileType;
  /**
   * Used to determine whether to use the up to date ProfileContext when rendering the Profile screen, or whether to use
   * the route params.
   *
   * @see ProfileStackScreen for more details
   */
  isLoggedInUsersProfile: boolean;
}
