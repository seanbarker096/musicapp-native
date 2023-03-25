/** ------------------- ARTISTS SEARCH ------------------------ */

import { QueryKey, useQuery } from 'react-query';
import { getRequest, searchRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { artistsKeys } from './artists.query-keys';
import {
  transformArtistApi,
  transformArtistSearchArtistApi,
} from './artists.transformations';
import { Artist, ArtistSearchArtist, ArtistsStoreSlice } from './artists.types';

const artistsSearch = async (searchQuery: string) => {
  // for empty strings e.g. when backspacing, return empty array
  if (!searchQuery) {
    return [];
  }

  const response = await searchRequest<ArtistsStoreSlice>({
    url: 'performers/0.1/performers/search',
    body: { search_query: searchQuery },
  });

  return response.data.artists.map(artistSearchArtistApi =>
    transformArtistSearchArtistApi(artistSearchArtistApi),
  );
};

export function useArtistsSearchQuery(searchQuery: string) {
  return useQuery<
    readonly ArtistSearchArtist[],
    unknown,
    readonly ArtistSearchArtist[]
  >(artistsKeys.artistsBySearchQuery(searchQuery), () =>
    artistsSearch(searchQuery),
  );
}

/** ------------------ ARTIST_GET_OR_CREATE --------------------------- */

// all search selections should call this endpoint. Other pages that require the artist to exist in our db to load should call the normal artist_get endpoints

async function artistGetOrCreate(artistUUID: string) {
  if (!artistUUID) {
    Promise.reject('artistUUID must be defined to get artist');
  }

  const response = await getRequest<ArtistsStoreSlice<'Document'>>({
    url: `performers/0.1/performer/${artistUUID}`,
    params: {},
  });

  return transformArtistApi(response.data);
}

export function useArtistGetOrCreateQuery({
  artistUUID,
  enabled,
  onSuccess,
}: {
  artistUUID: string | undefined;
  enabled: boolean;
  onSuccess?: (artist: Artist) => void;
}) {
  let queryKey: QueryKey = artistsKeys.null;

  if (artistUUID) {
    queryKey = artistsKeys.artistByUUID(artistUUID);
  }

  return useQuery<Artist, unknown, Artist>(
    queryKey,
    () =>
      artistUUID
        ? artistGetOrCreate(artistUUID)
        : failedQuery(
            'Invalid uuid. Artist uuid must be defined to get or create artist',
          ),
    { enabled, onSuccess },
  );
}

/** ------------------ ARTIST_GET --------------------------- */

type ArtistObjectFields = keyof ArtistsStoreSlice['ObjectType'];

type ArtistsGetQueryFields = Partial<{
  [key in ArtistObjectFields]:
    | ArtistsStoreSlice['ObjectType'][key]
    | readonly ArtistsStoreSlice['ObjectType'][key][];
}>;

async function artistGet(
  params: ArtistsStoreSlice['Get']['RequestParametersType'],
) {
  const response = await getRequest<ArtistsStoreSlice>({
    url: `performers/0.1/performers`,
    params,
  });

  return response.data.artists.map(artist => transformArtistApi(artist));
}

export function useArtistsGetQuery({
  queryParams: { id },
  enabled = true,
}: {
  queryParams: ArtistsGetQueryFields;
  enabled?: boolean;
}) {
  let apiQueryParams:
    | ArtistsStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = artistsKeys.null;

  if (id) {
    const processedId = isArray(id) ? id : [id];

    apiQueryParams = {
      ids: processedId,
    };

    queryKey = artistsKeys.artistsByIds(processedId);
  }

  return useQuery<readonly Artist[], unknown, readonly Artist[]>(queryKey, () =>
    apiQueryParams
      ? artistGet(apiQueryParams)
      : failedQuery(`Invalid query params. ${JSON.stringify(apiQueryParams)}`),
  );
}
