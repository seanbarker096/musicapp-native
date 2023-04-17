import { QueryKey, useQuery } from 'react-query';
import { transformFeatureApi } from 'store/features/features.transformations';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { usersPostsFeaturesKeys } from './users-posts-features.query-keys';
import {
  UsersPostsFeaturesGetFilter,
  UsersPostsFeaturesGetFilterApi,
  UsersPostsFeaturesStoreSlice,
} from './users-posts-features.types';

async function getUsersPostsFeatures(
  params: UsersPostsFeaturesGetFilterApi,
): Promise<readonly UsersPostsFeaturesStoreSlice['ObjectType'][]> {
  const response = await getRequest<UsersPostsFeaturesStoreSlice>({
    url: 'features/0.1/posts',
    params,
  });

  return response.data.features_by_post_id.map(feature =>
    transformFeatureApi(feature),
  );
}

export function useUsersPostsFeaturesGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: UsersPostsFeaturesGetFilter;
  enabled?: boolean;
}) {
  let queryKey: QueryKey = usersPostsFeaturesKeys.null;

  let apiQueryParams: UsersPostsFeaturesGetFilterApi | undefined = undefined;

  const { featurerType, postOwnerId } = queryParams;

  if (featurerType && postOwnerId) {
    queryKey =
      usersPostsFeaturesKeys.usersPostsFeaturesByPostOwnerAndFeaturerType(
        postOwnerId,
        featurerType,
      );

    apiQueryParams = {
      featurer_type: featurerType,
      post_owner_id: postOwnerId,
    };
  }

  return useQuery(
    queryKey,
    () =>
      apiQueryParams
        ? getUsersPostsFeatures(apiQueryParams)
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
