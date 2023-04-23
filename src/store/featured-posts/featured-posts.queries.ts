import { QueryKey, useQuery } from 'react-query';
import { Post } from 'store/posts';
import { transformPostApi } from 'store/posts/posts.transformations';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isDefined } from 'utils/utils';
import { featuredPostKeys } from './featured-posts.query-keys';
import { FeaturedPostsStoreSlice } from './featured-posts.types';

type FeaturedPostObjectFields = keyof FeaturedPostsStoreSlice['ObjectType'];

export type FeaturedPostsGetQueryFields = Partial<{
  [key in FeaturedPostObjectFields]: FeaturedPostsStoreSlice['ObjectType'][key];
}> & {
  isFeaturedByUsers: boolean;
  isFeaturedByPerformers: boolean;
};

async function featuredPostsGet(
  params: FeaturedPostsStoreSlice['Get']['RequestParametersType'],
) {
  const response = await getRequest<FeaturedPostsStoreSlice>({
    url: 'posts/0.1/featured',
    params: {
      owner_id: params.owner_id,
      owner_type: params.owner_type,
      is_featured_by_users: params.is_featured_by_users,
      is_featured_by_performers: params.is_featured_by_performers,
    },
  });

  const postsAndAttachments = response.data;

  return postsAndAttachments.posts.map(post => transformPostApi(post));
}

export function useFeaturedPostsGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: FeaturedPostsGetQueryFields;
  enabled?: boolean;
}) {
  const { ownerId, ownerType, isFeaturedByUsers, isFeaturedByPerformers } =
    queryParams;

  console.log(queryParams);
  let apiQueryParams:
    | FeaturedPostsStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = featuredPostKeys.null;

  if (
    ownerId &&
    ownerType &&
    isDefined(isFeaturedByPerformers) &&
    isDefined(isFeaturedByUsers)
  ) {
    apiQueryParams = {
      owner_id: ownerId,
      owner_type: ownerType,
      is_featured_by_performers: isFeaturedByPerformers,
      is_featured_by_users: isFeaturedByUsers,
    };

    queryKey = featuredPostKeys.featuredPostsByOwner(ownerId, ownerType);
  }

  return useQuery<readonly Post[], unknown, readonly Post[]>(
    queryKey,
    () =>
      apiQueryParams
        ? featuredPostsGet(apiQueryParams)
        : failedQuery(
            `Invalid Featured Posts get query params or unsupported query. Query: ${JSON.stringify(
              apiQueryParams,
            )}`,
          ),
    { enabled },
  );
}
