/** ------------------- ARTISTS SEARCH ------------------------ */

import { QueryKey, useQuery } from 'react-query';
import { getRequest, searchRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
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
    url: 'artists/0.1/artists/search',
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
    url: `artists/0.1/artist/${artistUUID}`,
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
