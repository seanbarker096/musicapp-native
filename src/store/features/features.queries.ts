import { QueryKey, useMutation, useQuery, useQueryClient } from 'react-query';
import { getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { featuresKeys } from './features.query-keys';
import { transformFeatureApi } from './features.transformations';
import {
  FeatureCreateRequest,
  FeaturedEntityType,
  FeaturesStoreSlice,
} from './features.types';

type FeatureObjectFields = keyof FeaturesStoreSlice['ObjectType'];

/* -------------------- GET FEATURES -------------------- */
type FeaturesGetQueryField = Partial<{
  [key in FeatureObjectFields]: FeaturesStoreSlice['ObjectType'][key];
}>;

async function getFeatures(
  params: FeaturesStoreSlice['Get']['RequestParametersType'],
): Promise<readonly FeaturesStoreSlice['ObjectType'][]> {
  const response = await getRequest<FeaturesStoreSlice>({
    url: 'features/0.1/features',
    params,
  });

  return response.data.features.map(feature => transformFeatureApi(feature));
}

export function useFeaturesGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: FeaturesGetQueryField;
  enabled?: boolean;
}) {
  let queryKey: QueryKey = featuresKeys.null;

  let apiQueryParams:
    | FeaturesStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  const { featurerType, featurerId, featuredEntityType, featuredEntityId } =
    queryParams;

  if (
    featuredEntityType === FeaturedEntityType.POST &&
    featurerType &&
    featurerId &&
    featuredEntityId
  ) {
    queryKey = featuresKeys.postFeaturesByFeaturer(featurerId, featurerType);
    apiQueryParams = {
      featurer_type: featurerType,
      featurer_id: featurerId,
      featured_entity_type: featuredEntityType,
      featured_entity_id: featuredEntityId,
    };
  }

  return useQuery(
    queryKey,
    () =>
      apiQueryParams
        ? getFeatures(apiQueryParams)
        : failedQuery(
            `Invalid query params or unsupported query. Query: ${JSON.stringify(
              queryParams,
            )}`,
          ),
    {
      enabled,
    },
  );
}

/* -------------------- FEATURE CREATE -------------------- */
async function featureCreate(request: FeatureCreateRequest) {
  const response = await postRequest<FeaturesStoreSlice>({
    url: 'features/0.1/features',
    body: {
      featured_entity_type: request.featuredEntityType,
      featured_entity_id: request.featuredEntityId,
      featurer_type: request.featurerType,
      featurer_id: request.featurerId,
    },
  });

  return transformFeatureApi(response.data.feature);
}

export function useFeatureCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    FeaturesStoreSlice['ObjectType'],
    any,
    FeatureCreateRequest
  >(request => featureCreate(request), {
    onSuccess: data => {
      return queryClient.invalidateQueries(
        featuresKeys.postFeaturesByFeaturer(data.featurerId, data.featurerType),
      );
    },
  });
}
