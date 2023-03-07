import { StoreSlice } from 'store/store.types';

export interface FeaturesStoreSlice extends StoreSlice {
  Name: 'features';
  ObjectType: Feature;
  Get: {
    RequestParametersType: FeaturesGetFilterApi;
    ResultType: FeaturesGetResultApi;
    ErrorType: {};
  };
  Post: {
    RequestBodyType: FeatureCreateRequestApi;
    ResultType: FeatureCreateResultApi;
    ErrorType: {};
  };
}

export interface Feature {
  id: number;
  contextType: FeatureContextType;
  contextId: number;
  ownerType: FeatureOwnerType;
  ownerId: number;
}

export interface FeatureApi {
  id: number;
  context_type: FeatureContextType;
  context_id: number;
  owner_type: FeatureOwnerType;
  owner_id: number;
}

export enum FeatureContextType {
  POST = 'post',
}

export enum FeatureOwnerType {
  USER = 'user',
  ARTIST = 'artist',
}

export interface FeaturesGetFilterApi {
  owner_type?: FeatureOwnerType;
  owner_id?: number;
  context_type?: FeatureContextType;
  context_id?: number;
}

export interface FeaturesGetResultApi {
  features: readonly FeatureApi[];
}

export interface FeatureCreateRequest {
  contextType: FeatureContextType;
  contextId: number;
  ownerType: FeatureOwnerType;
  ownerId: number;
}

export interface FeatureCreateRequestApi {
  context_type: FeatureContextType;
  context_id: number;
  owner_type: FeatureOwnerType;
  owner_id: number;
}

export interface FeatureCreateResultApi {
  feature: FeatureApi;
}
