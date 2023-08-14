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

const MAX_ALLOWED_SPOTIFY_API_LIMIT = 50;

const performersSearch = async (searchQuery: string, limit: number) => {
  // for empty strings e.g. when backspacing, return empty array
  if (!searchQuery) {
    return [];
  }

  const response = await searchRequest<PerformersStoreSlice>({
    url: 'performers/0.1/performers/search',
    body: { search_query: searchQuery, limit },
  });

  return response.data.performers.map(performerSearchPerformerApi =>
    transformPerformerSearchPerformerApi(performerSearchPerformerApi),
  );
};

export function usePerformersSearchQuery({
  searchQuery,
  limit = 10,
  enabled = true,
  onSettled,
}: {
  searchQuery?: string;
  limit?: number;
  enabled?: boolean;
  onSettled?: (
    data: readonly PerformerSearchPerformer[] | undefined,
    error: unknown,
  ) => void;
}) {
  let query: string | undefined = undefined;

  let queryKey: QueryKey = performersKeys.null('usePerformersSearchQuery');

  if (limit > MAX_ALLOWED_SPOTIFY_API_LIMIT) {
    limit = MAX_ALLOWED_SPOTIFY_API_LIMIT;
  }

  if (searchQuery) {
    query = searchQuery;
    queryKey = performersKeys.performersBySearchQuery(searchQuery, limit);
  }

  return useQuery<
    readonly PerformerSearchPerformer[] | undefined,
    unknown,
    readonly PerformerSearchPerformer[]
    // to ensure loading states work correctly, if a search term i sundefined (e.g. by backspacing) we still resolve the promise, but with an empty array
  >(
    queryKey,
    () => (query ? performersSearch(query, limit) : Promise.resolve(undefined)),
    {
      enabled,
      onSettled,
      keepPreviousData: true, // Needed otherwise the results array becomes undefined between follow up requests, e.g. when incrementing the limit whilst scrolling through results
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
  enabled = true,
  onSuccess,
}: {
  performerUUID: string | undefined;
  enabled: boolean;
  onSuccess?: (performer: Performer) => void;
}) {

  let queryKey: QueryKey = performersKeys.null('usePerformerGetOrCreateQuery');

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
    url: `performers/0.1/performers/`,
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

  let queryKey: QueryKey = performersKeys.null('usePerformersGetQuery');

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
