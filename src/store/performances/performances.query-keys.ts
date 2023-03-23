export const performancesKeys = {
  all: 'performances',
  null: [],
  performancesByDateAndPerformerId: (
    performanceDate: number,
    performerId: number,
  ) => [
    performancesKeys.all,
    'performanceDate',
    performanceDate,
    'performerId',
    performerId,
  ],
  performancesByPerformerIdsAndPerformanceDate: (
    performerIds: readonly number[],
    performanceDate: number,
  ) => [
    performancesKeys.all,
    'performerIds',
    ...performerIds,
    'performanceDate',
    performanceDate,
  ],
};
