/** ------------------- ARTISTS SEARCH ------------------------ */

import { useQuery } from 'react-query';
import { searchRequest } from 'store/request-builder';
import { artistsKeys } from './artists.query-keys';
import { transformArtistSearchArtistApi } from './artists.transformations';
import { ArtistSearchArtist, ArtistsStoreSlice } from './artists.types';

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
