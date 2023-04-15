import { QueryKey, useQuery } from 'react-query';
import { transformEventApi } from 'store/events/events.transformations';
import { Event, EventsStoreSlice } from 'store/events/events.types';
import { transformPerformanceApi } from 'store/performances/performances.transformations';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { performancesCountsKeys } from './performances-counts.query-keys';
import { transformPerformanceCountsApi } from './performances-counts.transformations';
import {
  PerformanceCountsApi,
  PerformanceWithCounts,
  PerformancesCountsGetFilter,
  PerformancesCountsGetFilterApi,
  PerformancesCountsStoreSlice,
} from './performances-counts.types';

async function performancesCountsGet(
  params: PerformancesCountsGetFilterApi,
): Promise<readonly PerformanceWithCounts[]> {
  const response = await getRequest<PerformancesCountsStoreSlice>({
    url: `performances/0.1/performances/counts`,
    params: params,
  });

  const { counts, performances: performancesApi } = response.data;

  // Add the event information to the performance
  const eventsResponse = await getRequest<EventsStoreSlice>({
    url: `events/0.1/events`,
    params: {
      ids: performancesApi.map(performance => performance.event_id),
    },
  });

  const eventsByIdMap: { [id: number]: Event } = {};

  eventsResponse.data.events.map(transformEventApi).forEach(event => {
    eventsByIdMap[event.id] = event;
  });

  const performancesWithEventInfo = performancesApi
    .map(transformPerformanceApi)
    .map(performance => {
      const { id, ...eventWithoutId } = eventsByIdMap[performance.eventId];

      return {
        ...performance,
        ...eventWithoutId,
      };
    });

  // add the counts to the performance
  const performanceCountsByPerformanceIds: {
    [performanceId: number]: PerformanceCountsApi;
  } = {};

  counts.forEach(count => {
    performanceCountsByPerformanceIds[count.performance_id] = count;
  });

  return performancesWithEventInfo.map(performance => {
    const performanceCountsApi =
      performanceCountsByPerformanceIds[performance.id];

    const performanceCounts =
      transformPerformanceCountsApi(performanceCountsApi);

    return {
      ...performance,
      ...performanceCounts,
    };
  });
}

export function usePerformancesCountsGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: Partial<PerformancesCountsGetFilter>; // Partial because for dependent queries, these may be undefined if the parent query is still loading
  enabled?: boolean;
}) {
  const {
    performanceIds,
    includeAttendeeCount = false,
    includeTagCount = false,
    includeFeaturesCount = false,
  } = queryParams;

  let apiQueryParams: PerformancesCountsGetFilterApi | undefined;
  let queryKey: QueryKey = performancesCountsKeys.null;

  if (performanceIds) {
    apiQueryParams = {
      performance_ids: performanceIds,
      include_attendee_count: includeAttendeeCount,
      include_tag_count: includeTagCount,
      include_features_count: includeFeaturesCount,
    };

    queryKey = performancesCountsKeys.performancesCountsByPerformanceIds(
      performanceIds,
      includeTagCount,
      includeAttendeeCount,
      includeFeaturesCount,
    );
  }

  return useQuery<
    readonly PerformanceWithCounts[],
    unknown,
    readonly PerformanceWithCounts[]
  >(
    queryKey,
    () =>
      apiQueryParams
        ? performancesCountsGet(apiQueryParams)
        : failedQuery(
            `Invalid query params for performancesCounts GET request. ${JSON.stringify(
              apiQueryParams,
            )}`,
          ),
    {
      enabled,
    },
  );
}
