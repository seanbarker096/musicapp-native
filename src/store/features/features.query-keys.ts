import { FeaturerType } from './features.types';

export const featuresKeys = {
  all: ['features'] as const,
  postFeaturesByFeaturer: (featurerId: number, featurerType: FeaturerType) =>
    [...featuresKeys.all, 'posts', featurerType, featurerId] as const,
  null: [],
};
