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
  featuredEntityType: FeaturedEntityType;
  featuredEntityId: number;
  featurerType: FeaturerType;
  featurerId: number;
  creatorId: number;
}

export interface FeatureApi {
  id: number;
  featured_entity_type: FeaturedEntityType;
  featured_entity_id: number;
  featurer_type: FeaturerType;
  featurer_id: number;
  creator_id: number;
}

export enum FeaturedEntityType {
  POST = 'post',
}

export enum FeaturerType {
  USER = 'user',
  ARTIST = 'artist',
}

export interface FeaturesGetFilterApi {
  featurer_type?: FeaturerType;
  featurer_id?: number;
  featured_entity_type?: FeaturedEntityType;
  featured_entity_id?: number;
}

export interface FeaturesGetResultApi {
  features: readonly FeatureApi[];
}

export interface FeatureCreateRequest {
  featuredEntityType: FeaturedEntityType;
  featuredEntityId: number;
  featurerType: FeaturerType;
  featurerId: number;
}

export interface FeatureCreateRequestApi {
  featured_entity_type: FeaturedEntityType;
  featured_entity_id: number;
  featurer_type: FeaturerType;
  featurer_id: number;
}

export interface FeatureCreateResultApi {
  feature: FeatureApi;
}
