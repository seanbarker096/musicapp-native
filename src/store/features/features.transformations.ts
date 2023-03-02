import { Feature, FeatureApi } from './features.types';

export const transformFeatureApi = (
  featureApi: FeatureApi,
): Feature => ({
  id: featureApi.id,
  contextType: featureApi.context_type,
  contextId: featureApi.context_id,
  ownerType: featureApi.owner_type,
  ownerId: featureApi.owner_id,
});
