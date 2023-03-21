export const performancesKeys = {
  all: 'performances',
  performancesByDateAndPerformerId: (venueId: number, performerId: number) => [
    performancesKeys.all,
    'venueId',
    venueId,
    'performerId',
    performerId,
  ],
};
