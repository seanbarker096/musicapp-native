import { FeaturerType } from 'store/features/features.types';

export const usersPostsFeaturesKeys = {
  all: ['usersPostsFeatures'] as const,
  usersPostsFeaturesByPostOwnerAndFeaturerType: (
    postOwnerId: number,
    featurerType: FeaturerType,
  ) =>
    [
      ...usersPostsFeaturesKeys.all,
      'postOwnerId',
      postOwnerId,
      'featurerType',
      featurerType,
    ] as const,
  null: [],
};
