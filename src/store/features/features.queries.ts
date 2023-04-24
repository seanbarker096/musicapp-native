import { QueryKey, useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteRequest, getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { featuresKeys } from './features.query-keys';
import { transformFeatureApi } from './features.transformations';
import {
  FeatureCreateRequest,
  FeaturedEntityType,
  FeaturerType,
  FeaturesDeleteRequest,
  FeaturesStoreSlice,
} from './features.types';

// ------------------ FEATURES DELETE ------------------ //

async function featuresDelete({ ids }: FeaturesDeleteRequest) {
  const response = await deleteRequest<FeaturesStoreSlice>({
    url: 'features/0.1/features',
    params: {
      ids,
    },
  });

  return response.data;
}

export const useFeaturesDeleteMutation = ({
  featurerId,
  featurerType,
  postIds,
}: {
  featurerId?: number;
  featurerType?: FeaturerType;
  postIds?: readonly number[];
} = {}) => {
  const queryClient = useQueryClient();

  const onSuccessCallback = async () => {
    // Be specific with invalidation if we can, otherwise invalidate all tags. If postIds arent provided we can
    // invalidate the slightly less specific ids, because the key factory function accepts undefined postIds
    if (featurerId && featurerType) {
      return queryClient.invalidateQueries(
        featuresKeys.postFeaturesByFeaturer(featurerId, featurerType, postIds),
      );
    } else {
      return queryClient.invalidateQueries(featuresKeys.all);
    }
  };

  return useMutation<void, any, FeaturesDeleteRequest>(
    (request: FeaturesDeleteRequest) => featuresDelete(request),
    {
      onSuccess: onSuccessCallback,
    },
  );
};

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
    featurerId
  ) {
    queryKey = featuresKeys.postFeaturesByFeaturer(
      featurerId,
      featurerType,
      featuredEntityId ? [featuredEntityId] : undefined,
    );
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

export function useFeatureCreateMutation({
  featurerId,
  featurerType,
  postIds,
}: {
  featurerId?: number;
  featurerType?: FeaturerType;
  postIds?: readonly number[];
} = {}) {
  const queryClient = useQueryClient();

  const onSuccessCallback = async () => {
    // Be specific with invalidation if we can, otherwise invalidate all tags. If postIds arent provided we can
    // invalidate the slightly less specific ids, because the key factory function accepts undefined postIds
    if (featurerId && featurerType) {
      return queryClient.invalidateQueries(
        featuresKeys.postFeaturesByFeaturer(featurerId, featurerType, postIds),
      );
    } else {
      return queryClient.invalidateQueries(featuresKeys.all);
    }
  };

  return useMutation<
    FeaturesStoreSlice['ObjectType'],
    any,
    FeatureCreateRequest
  >(request => featureCreate(request), {
    onSuccess: onSuccessCallback,
  });
}
