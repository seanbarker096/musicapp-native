export const performancesCountsKeys = {
  all: ['performancesCounts'],
  performancesCountsByPerformanceIds: (
    performanceIds: readonly number[],
    includeTagCount: boolean,
    includeAttendeeCount: boolean,
    includeFeaturesCount: boolean,
  ) => [
    ...performancesCountsKeys.all,
    'performanceIds',
    ...performanceIds,
    'includeTagCount',
    includeTagCount,
    'includeAttendeeCount',
    includeAttendeeCount,
    'includeFeaturesCount',
    includeFeaturesCount,
  ],
  null: [],
};
