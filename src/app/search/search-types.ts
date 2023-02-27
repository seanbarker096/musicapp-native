import { Artist } from 'store/artists';

export type SearchStackScreenParamList = {
  Search: undefined;
  ArtistProfile: {
    artist: Artist;
  };
};
