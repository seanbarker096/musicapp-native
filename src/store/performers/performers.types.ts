import { GetRequestTypes, StoreSlice } from 'store/store.types';

export interface PerformersStoreSlice<T extends GetRequestTypes = 'Collection'>
  extends StoreSlice {
  ObjectType: Performer;
  Get: {
    RequestParametersType: PerformersGetFilterApi;
    ResultType: T extends 'Collection' ? PerformersGetResultApi : PerformerApi;
    ErrorType: {};
  };
  Post: {
    RequestBodyType: PerformerCreateRequestApi;
    ResultType: PerformerCreateResultApi;
    ErrorType: {};
  };
  Search: {
    RequestBodyType: PerformerSearchRequestApi;
    ResultType: PerformersGetResultApi;
    ErrorType: {};
  };
}

export interface Performer {
  id: number;
  name: string;
  uuid: string;
  biography?: string;
  createTime: number;
  updateTime?: number;
  ownerId?: number;
  imageUrl?: string;
}

export interface PerformerApi {
  id: number;
  name: string;
  uuid: string;
  biography?: string;
  create_time: number;
  update_time?: number;
  owner_id?: number;
  image_url?: string;
}

export interface PerformerSearchPerformer {
  uuid: string;
  name: string;
  imageUrl?: string;
}

export interface PerformerSearchPerformerApi {
  uuid: string;
  name: string;
  image_url?: string;
}

export interface PerformersGetFilterApi {
  ids?: readonly number[];
  uuids?: readonly string[];
  owner_ids?: readonly number[];
  search_query?: string;
}

export interface PerformerSearchRequestApi {
  search_query: string;
}

export interface PerformersGetResultApi {
  performers: readonly PerformerApi[];
}

export interface PerformerCreateRequestApi {
  uuid: string;
  name: string;
  biography?: string;
  ownerId?: number;
}

export interface PerformerCreateResultApi {
  performer: PerformerApi;
}