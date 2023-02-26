import { StoreSlice } from 'store/store.types';

export interface ArtistsStoreSlice extends StoreSlice {
  ObjectType: Artist;
  Get: {
    RequestParametersType: ArtistsGetFilterApi;
    ResultType: ArtistsGetResultApi;
    ErrorType: {};
  };
  Post: {
    RequestBodyType: ArtistCreateRequestApi;
    ResultType: ArtistCreateResultApi;
    ErrorType: {};
  };
  Search: {
    RequestBodyType: ArtistSearchRequestApi;
    ResultType: ArtistsGetResultApi;
    ErrorType: {};
  };
}

export interface Artist {
  id: number;
  name: string;
  uuid: string;
  biography?: string;
  createTime: number;
  updateTime?: number;
  ownerId?: number;
}

export interface ArtistApi {
  id: number;
  name: string;
  uuid: string;
  biography?: string;
  create_time: number;
  update_time?: number;
  owner_id?: number;
}

export interface ArtistSearchArtist {
  uuid: string;
  name: string;
  imageUrl?: string;
}

export interface ArtistSearchArtistApi {
  uuid: string;
  name: string;
  image_url?: string;
}

export interface ArtistsGetFilterApi {
  uuids?: readonly string[];
  search_query?: string;
}

export interface ArtistSearchRequestApi {
  search_query: string;
}

export interface ArtistsGetResultApi {
  artists: readonly ArtistApi[];
}

export interface ArtistCreateRequestApi {
  uuid: string;
  name: string;
  biography?: string;
  ownerId?: number;
}

export interface ArtistCreateResultApi {
  artist: ArtistApi;
}
