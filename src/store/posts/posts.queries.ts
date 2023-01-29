import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { transformPostAttachmentApi } from 'store/post-attachments/post-attachments.trasnformations';
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
  queryClient: QueryClient,
) => {
  const response = await getRequest<PostsStoreSlice>({
    url: 'posts/0.1/posts',
    params,
  });

  const postsAndAttachments = response.data;

  const attachments = postsAndAttachments.attachments;

  if (attachments) {
    attachments.forEach(attachment => {
      queryClient.setQueryData(
        ['postAttachments', attachment.post_id],
        transformPostAttachmentApi(attachment),
      );
    });
  }

  return postsAndAttachments.posts.map(post => transformPostApi(post));
};

export const usePostsGetQuery = ({ ownerId }: PostsGetQueryField) => {
  const queryClient = useQueryClient();

  if (!ownerId) {
    throw Error('ownerId must be defined to get posts');
  }

  const isArrayFilterField = isArray(ownerId);

  let ownerIdQueryParam = isArrayFilterField ? ownerId[0] : ownerId;
  let apiQueryParams = { owner_ids: [ownerIdQueryParam] };

  return useQuery<readonly Post[], unknown, readonly Post[]>(
    postsKeys.postsByOwnerId(ownerIdQueryParam),
    () => postsGet(apiQueryParams, queryClient),
  );
};
