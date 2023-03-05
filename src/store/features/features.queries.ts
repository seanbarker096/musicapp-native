import { QueryKey, useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { featuresKeys } from './features.query-keys';
import { transformFeatureApi } from './features.transformations';
import {
  FeatureContextType,
  FeatureOwnerType,
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

  const { ownerType, ownerId, contextType } = queryParams;

  if (
    contextType === FeatureContextType.POST &&
    ownerType === FeatureOwnerType.ARTIST &&
    ownerId
  ) {
    queryKey = featuresKeys.postFeaturesByArtistId(ownerId);
    apiQueryParams = {
      owner_type: ownerType,
      owner_id: ownerId,
      context_type: contextType,
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
