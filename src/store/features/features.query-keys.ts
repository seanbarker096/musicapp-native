import { FeaturerType } from './features.types';

export const featuresKeys = {
  all: ['features'] as const,
  postFeaturesByFeaturer: (
    featurerId: number,
    featurerType: FeaturerType,
    postIds: readonly number[] | undefined = [],
  ) =>
    [
      ...featuresKeys.all,
      'posts',
      'featurerType',
      featurerType,
      'featurerId',
      featurerId,
      'postIds',
      ...postIds,
    ] as const,
  null: [],
};
