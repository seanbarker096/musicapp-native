import { Artist } from 'store/artists';

export type SearchStackScreenParamList = {
  Search: undefined;
  ArtistProfileStackScreen: {
    artist: Artist;
  };
};
