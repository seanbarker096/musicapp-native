import { useQuery, useQueryClient } from 'react-query';
import { getRequest } from 'store/request-builder';
import { isArray } from 'utils/utils';
import { postsKeys } from './posts.query-keys';
import { transformPostApi } from './posts.transformations';
import { Post, PostsGetResultApi, PostsStoreSlice } from './posts.types';

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

  return response.data;
};

export const usePostsGetQuery = ({ ownerId }: PostsGetQueryField) => {
  const queryClient = useQueryClient();

  if (!ownerId) {
    throw Error('ownerId must be defined to get posts');
  }

  const isArrayFilterField = isArray(ownerId);

  let ownerIdQueryParam = isArrayFilterField ? ownerId[0] : ownerId;
  let apiQueryParams = { owner_ids: [ownerIdQueryParam] };

  return useQuery<PostsGetResultApi, unknown, readonly Post[]>(
    postsKeys.postsByOwnerId(ownerIdQueryParam),
    () => postsGet(apiQueryParams),
    {
      select: postsAndAttacments => {
        const attachments = postsAndAttacments.attachments;

        if (attachments) {
          attachments.forEach(attachment => {
            queryClient.setQueryData(
              ['postAttachments', attachment.postId],
              attachment,
            );
          });
        }

        return postsAndAttacments.posts.map(post => transformPostApi(post));
      },
    },
  );
};
