export const performancesKeys = {
  all: ['performances'],
  null: [],
  performancesByIds: (ids: readonly number[]) => [
    ...performancesKeys.all,
    'id',
    ...ids,
  ],
  performancesByPerformerIds: (performerIds: readonly number[]) => [
    ...performancesKeys.all,
    'performerIds',
    ...performerIds,
  ],
  performancesByPerformerIdsAndPerformanceDate: (
    performerIds: readonly number[],
    performanceDate: number,
  ) => [
    ...performancesKeys.all,
    'performerIds',
    ...performerIds,
    'performanceDate',
    performanceDate,
  ],
  attendeePerformancesByPerformerIds: (
    performerIds: readonly number[],
    attendeeIds: readonly number[],
  ) => [
    ...performancesKeys.all,
    'performerIds',
    ...performerIds,
    'attendeeIds',
    ...attendeeIds,
  ],
};
