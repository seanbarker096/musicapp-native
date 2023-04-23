export type PerformanceStackParamList = {
  Performance: {
    performanceId: number;
    performerId: number;
  };
  ViewPost: {
    postId: number;
  };
};

export enum PerformancePostTabs {
  FEATURED = 'FEATURED',
  FAN_CAPTURES = 'FAN_CAPTURES',
}
