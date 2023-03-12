import { Feature, FeatureApi } from './features.types';

export const transformFeatureApi = (featureApi: FeatureApi): Feature => ({
  id: featureApi.id,
  featuredEntityType: featureApi.featured_entity_type,
  featuredEntityId: featureApi.featured_entity_id,
  featurerType: featureApi.featurer_type,
  featurerId: featureApi.featurer_id,
  creatorId: featureApi.creator_id,
});
