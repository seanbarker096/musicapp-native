import { Performance, PerformanceApi } from './performances.types';

export function transformPerformanceApi(
  performance: PerformanceApi,
): Performance {
  return {
    id: performance.id,
    eventId: performance.event_id,
    performerId: performance.performer_id,
    performanceDate: performance.performance_date,
    createTime: performance.create_time,
    updateTime: performance.update_time,
  };
}
