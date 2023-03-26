import { QueryKey, useMutation, useQuery } from 'react-query';
import { getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { performancesKeys } from './performances.query-keys';
import { transformPerformanceApi } from './performances.transformations';
import {
  Performance,
  PerformanceCreateRequest,
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
) {
  const response = await getRequest<PerformancesStoreSlice>({
    url: `performances/0.1/performances`,
    params: params,
  });

  return response.data.performances.map(transformPerformanceApi);
}

export function usePerformancesGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: PerformancesGetQueryField;
  enabled?: boolean;
}) {
  const { performerId, performanceDate, attendeeId } = queryParams;

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
  venueId,
}: PerformanceCreateRequest) {
  const repsonse = await postRequest<PerformancesStoreSlice>({
    url: `performances/0.1/performances`,
    body: {
      performer_id: performerId,
      performance_date: performanceDate,
      venue_id: venueId,
    },
  });

  return transformPerformanceApi(repsonse.data.performance);
}

export function usePerformanceCreateMutation() {
  return useMutation<Performance, any, PerformanceCreateRequest>(
    (request: PerformanceCreateRequest) => performanceCreate(request),
  );
}
