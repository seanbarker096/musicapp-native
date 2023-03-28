import { PerformanceCountsApi } from './performances-counts.types';

export function transformPerformanceCountsApi(
  performanceCounts: PerformanceCountsApi,
) {
  return {
    performanceId: performanceCounts.performance_id,
    attendeeCount: performanceCounts.attendee_count,
    tagCount: performanceCounts.tag_count,
    featuresCount: performanceCounts.features_count,
  };
}
