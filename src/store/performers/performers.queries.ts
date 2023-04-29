/** ------------------- PERFORMERS SEARCH ------------------------ */

import { QueryKey, useQuery } from 'react-query';
import { getRequest, searchRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray, isDefined } from 'utils/utils';
import { performersKeys } from './performers.query-keys';
import {
  transformPerformerApi,
  transformPerformerSearchPerformerApi,
} from './performers.transformations';
import {
  Performer,
  PerformerSearchPerformer,
  PerformersStoreSlice,
} from './performers.types';

const performersSearch = async (searchQuery: string) => {
  // for empty strings e.g. when backspacing, return empty array
  if (!searchQuery) {
    return [];
  }

  const response = await searchRequest<PerformersStoreSlice>({
    url: 'performers/0.1/performers/search',
    body: { search_query: searchQuery },
  });

  return response.data.performers.map(performerSearchPerformerApi =>
    transformPerformerSearchPerformerApi(performerSearchPerformerApi),
  );
};

export function usePerformersSearchQuery({
  searchQuery,
  enabled = true,
}: {
  searchQuery?: string;
  enabled?: boolean;
}) {
  let query: string | undefined = undefined;

  let queryKey: QueryKey = performersKeys.null;

  if (searchQuery) {
    query = searchQuery;
    queryKey = performersKeys.performersBySearchQuery(searchQuery);
  }

  return useQuery<
    readonly PerformerSearchPerformer[],
    unknown,
    readonly PerformerSearchPerformer[]
  >(
    queryKey,
    () =>
      query
        ? performersSearch(query)
        : failedQuery(
            'Invalid search query. Search query must be defined to search performers',
          ),
    {
      enabled,
    },
  );
}

/** ------------------ PERFORMER_GET_OR_CREATE --------------------------- */

// all search selections should call this endpoint. Other pages that require the performer to exist in our db to load should call the normal performer_get endpoints

async function performerGetOrCreate(performerUUID: string) {
  if (!performerUUID) {
    Promise.reject('performerUUID must be defined to get performer');
  }

  const response = await getRequest<PerformersStoreSlice<'Document'>>({
    url: `performers/0.1/performer/${performerUUID}`,
    params: {},
  });

  return transformPerformerApi(response.data);
}

export function usePerformerGetOrCreateQuery({
  performerUUID,
  enabled,
  onSuccess,
}: {
  performerUUID: string | undefined;
  enabled: boolean;
  onSuccess?: (performer: Performer) => void;
}) {
  let queryKey: QueryKey = performersKeys.null;

  if (performerUUID) {
    queryKey = performersKeys.performerByUUID(performerUUID);
  }

  return useQuery<Performer, unknown, Performer>(
    queryKey,
    () =>
      performerUUID
        ? performerGetOrCreate(performerUUID)
        : failedQuery(
            'Invalid uuid. Performer uuid must be defined to get or create performer',
          ),
    { enabled, onSuccess },
  );
}

// ------------------ PERFORMER_GET --------------------------- //

type PerformerObjectFields = keyof PerformersStoreSlice['ObjectType'];

type PerformersGetQueryFields = Partial<{
  [key in PerformerObjectFields]:
    | PerformersStoreSlice['ObjectType'][key]
    | readonly PerformersStoreSlice['ObjectType'][key][];
}>;

async function performerGet(
  params: PerformersStoreSlice['Get']['RequestParametersType'],
) {
  const response = await getRequest<PerformersStoreSlice>({
    url: `performers/0.1/performers`,
    params,
  });

  return response.data.performers.map(performer =>
    transformPerformerApi(performer),
  );
}

export function usePerformersGetQuery({
  queryParams: { id, ownerId },
  enabled = true,
}: {
  queryParams: PerformersGetQueryFields;
  enabled?: boolean;
}) {
  let apiQueryParams:
    | PerformersStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = performersKeys.null;

  if (id) {
    const processedId = isArray(id) ? id : [id];

    apiQueryParams = {
      ids: processedId,
    };

    queryKey = performersKeys.performersByIds(processedId);
  }

  if (ownerId) {
    const processedOwnerId = isArray(ownerId)
      ? ownerId.filter(isDefined)
      : [ownerId];

    apiQueryParams = {
      owner_ids: processedOwnerId,
    };

    queryKey = performersKeys.performersByOwnerIds(processedOwnerId);
  }

  return useQuery<readonly Performer[], unknown, readonly Performer[]>(
    queryKey,
    () =>
      apiQueryParams
        ? performerGet(apiQueryParams)
        : failedQuery(
            `Invalid query params. ${JSON.stringify(apiQueryParams)}`,
          ),
  );
}
