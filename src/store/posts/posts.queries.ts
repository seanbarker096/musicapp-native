import { useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { isArray } from 'utils/utils';
import { postsKeys } from './posts.query-keys';
import { transformPostApi } from './posts.transformations';
import { Post, PostsStoreSlice } from './posts.types';

type PostObjectFields = keyof PostsStoreSlice['ObjectType'];

type PostsGetQueryField = Partial<{
  [key in PostObjectFields]:
    | PostsStoreSlice['ObjectType'][key]
    | readonly PostsStoreSlice['ObjectType'][key][];
}>;

const postsGet = async (
  params: PostsStoreSlice['Get']['RequestParametersType'],
) => {
  const response = await getRequest<PostsStoreSlice>({
    url: 'posts/0.1/posts',
    params,
  });

  const postsAndAttachments = response.data;

  return postsAndAttachments.posts.map(post => transformPostApi(post));
};

export const usePostsGetQuery = ({ ownerId }: PostsGetQueryField) => {
  if (!ownerId) {
    throw Error('ownerId must be defined to get posts');
  }

  const processedOwnerId = isArray(ownerId) ? ownerId : [ownerId];

  let apiQueryParams = { owner_ids: processedOwnerId };

  return useQuery<readonly Post[], unknown, readonly Post[]>(
    postsKeys.postsByOwnerIds(processedOwnerId),
    () => postsGet(apiQueryParams),
  );
};
