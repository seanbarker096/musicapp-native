import { QueryKey, useMutation, useQuery, useQueryClient } from 'react-query';
import { transformEventApi } from 'store/events/events.transformations';
import { Event, EventsStoreSlice } from 'store/events/events.types';
import { getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { performancesKeys } from './performances.query-keys';
import { transformPerformanceApi } from './performances.transformations';
import {
  Performance,
  PerformanceCreateRequest,
  PerformanceWithEvent,
  PerformancesStoreSlice,
} from './performances.types';

// ------------------- PERFORMANCES GET -------------------------------  //
type PerformanceObjectFields = keyof PerformancesStoreSlice['ObjectType'];

type PerformancesGetQueryField = Partial<
  {
    [key in PerformanceObjectFields]:
      | PerformancesStoreSlice['ObjectType'][key]
      | readonly PerformancesStoreSlice['ObjectType'][key][];
  } & { attendeeId?: number }
  // TODO: Find a better way to allow querying by fields that dont exist on the store objectType
>;

async function performancesGet(
  params: PerformancesStoreSlice['Get']['RequestParametersType'],
): Promise<readonly PerformanceWithEvent[]> {
  const response = await getRequest<PerformancesStoreSlice>({
    url: `performances/0.1/performances`,
    params: params,
  });

  const performancesApi = response.data.performances;

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

  return performancesApi.map(transformPerformanceApi).map(performance => {
    const { id, ...eventWithoutId } = eventsByIdMap[performance.eventId];

    return {
      ...performance,
      ...eventWithoutId,
    };
  });
}

export function usePerformancesGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: PerformancesGetQueryField;
  enabled?: boolean;
}) {
  const { performerId, performanceDate, attendeeId, id } = queryParams;

  let apiQueryParams:
    | PerformancesStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = performancesKeys.null;

  if (isArray(performanceDate)) {
    throw Error('Querying by multiple performance dates is not supported');
  }

  if (performerId && !performanceDate && !attendeeId) {
    const processedPerformerId = isArray(performerId)
      ? performerId
      : [performerId];

    apiQueryParams = {
      performer_ids: processedPerformerId,
    };

    queryKey =
      performancesKeys.performancesByPerformerIds(processedPerformerId);
  }

  if (performerId && performanceDate) {
    const processedPerformerId = isArray(performerId)
      ? performerId
      : [performerId];

    apiQueryParams = {
      performer_ids: processedPerformerId,
      performance_date: performanceDate,
    };

    queryKey = performancesKeys.performancesByPerformerIdsAndPerformanceDate(
      processedPerformerId,
      performanceDate,
    );
  }

  if (performerId && attendeeId) {
    const processedPerformerId = isArray(performerId)
      ? performerId
      : [performerId];

    const processedAttendeeId = isArray(attendeeId) ? attendeeId : [attendeeId];

    apiQueryParams = {
      performer_ids: processedPerformerId,
      attendee_ids: processedAttendeeId,
    };

    queryKey = performancesKeys.attendeePerformancesByPerformerIds(
      processedPerformerId,
      processedAttendeeId,
    );
  }

  if (id) {
    const processedId = isArray(id) ? id : [id];

    apiQueryParams = {
      ids: processedId,
    };

    queryKey = performancesKeys.performancesByIds(processedId);
  }

  return useQuery<readonly Performance[], unknown, readonly Performance[]>(
    queryKey,
    () =>
      apiQueryParams
        ? performancesGet(apiQueryParams)
        : failedQuery(
            `Invalid query params. ${JSON.stringify(apiQueryParams)}`,
          ),
    { enabled },
  );
}

// ----------------------------- PERFORMANCE CREATE ----------------------------- //
async function performanceCreate({
  performanceDate,
  performerId,
  eventEndDate,
  eventStartDate,
  venueName,
  eventType,
}: PerformanceCreateRequest) {
  const repsonse = await postRequest<PerformancesStoreSlice>({
    url: `performances/0.1/performances`,
    body: {
      performer_id: performerId,
      performance_date: performanceDate,
      event_start_date: eventStartDate,
      event_end_date: eventEndDate,
      venue_name: venueName,
      event_type: eventType,
    },
  });

  return transformPerformanceApi(repsonse.data.performance);
}

export function usePerformanceCreateMutation({
  performerId,
}: {
  performerId: number;
}) {
  const queryClient = useQueryClient();
  const onSuccessCallback = async () => {
    // invalidate relevant query keys
    // return the promise to mutation is still loading until queries invalidated
    return queryClient.invalidateQueries(
      performancesKeys.performancesByPerformerIds([performerId]),
    );
  };

  return useMutation<Performance, any, PerformanceCreateRequest>(
    (request: PerformanceCreateRequest) => performanceCreate(request),
    {
      onSuccess: onSuccessCallback,
    },
  );
}
