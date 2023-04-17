import { Feature, FeaturerType } from 'store/features/features.types';
import { StoreSlice } from 'store/store.types';

export interface UsersPostsFeaturesStoreSlice extends StoreSlice {
  Name: 'usersPostsFeatures';
  ObjectType: Feature;
  Get: {
    RequestParametersType: UsersPostsFeaturesGetFilterApi;
    ResultType: UsersPostsFeaturesGetFilterApi;
    ErrorType: {};
  };
  Post: never;
}

export interface UsersPostsFeaturesGetFilter {
  featurerType: FeaturerType;
  postOwnerId: number;
}

export interface UsersPostsFeaturesGetFilterApi {
  featurer_type: FeaturerType;
  post_owner_id: number;
}

export interface UsersPostsFeaturesGetFilterApi {
  features_by_post_id: {
    [post_id: number]: readonly Feature[];
  };
}
