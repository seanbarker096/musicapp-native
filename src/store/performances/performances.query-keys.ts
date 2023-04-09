export const performancesKeys = {
  all: ['performances'],
  null: [],
  performancesByIds: (ids: readonly number[]) => [
    ...performancesKeys.all,
    'id',
    ...ids,
  ],
  performancesByDateAndPerformerId: (
    performanceDate: number,
    performerId: number,
  ) => [
    ...performancesKeys.all,
    'performanceDate',
    performanceDate,
    'performerId',
    performerId,
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
  performancesByPerformerIds: (performerIds: readonly number[]) => [
    ...performancesKeys.all,
    'performerIds',
    ...performerIds,
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
