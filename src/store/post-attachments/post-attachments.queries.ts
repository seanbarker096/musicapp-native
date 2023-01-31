import { QueryKey, useQuery, useQueryClient } from 'react-query';
import { postsKeys } from 'store/posts/posts.query-keys';
import { addPostAttachmentsToPosts } from 'store/posts/posts.transformations';
import { Post } from 'store/posts/posts.types';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { postAttachmentsKeys } from './post-attachments.query-keys';
import { transformPostAttachmentApi } from './post-attachments.trasnformations';
import {
  PostAttachment,
  PostAttachmentsStoreSlice,
} from './post-attachments.types';

type PostAttachmentsObjectFields =
  keyof PostAttachmentsStoreSlice['ObjectType'];

type PostAttachmentGetQueryField = Partial<{
  [key in PostAttachmentsObjectFields]:
    | PostAttachmentsStoreSlice['ObjectType'][key]
    | readonly PostAttachmentsStoreSlice['ObjectType'][key][];
}>;

async function usePostAttachmentsGet(
  params: PostAttachmentsStoreSlice['Get']['RequestParametersType'],
) {
  const response = await getRequest<PostAttachmentsStoreSlice>({
    url: 'posts/0.1/attachments',
    params,
  });

  console.log(
    'result',
    response.data.attachments.map(attachment =>
      transformPostAttachmentApi(attachment),
    ),
  );

  return response.data.attachments.map(attachment =>
    transformPostAttachmentApi(attachment),
  );
}

export const usePostAttachmentsGetQuery = ({
  queryParams,
  enabled = true,
}: {
  queryParams: PostAttachmentGetQueryField;
  enabled: boolean;
}) => {
  const queryClient = useQueryClient();
  const { postId } = queryParams;

  let apiQueryParams:
    | PostAttachmentsStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = postAttachmentsKeys.null;

  if (postId) {
    apiQueryParams = {};
    apiQueryParams['post_ids'] = isArray(postId) ? postId : [postId];
    queryKey = postAttachmentsKeys.postAttachmentsByPostIds(postId);
  }

  return useQuery<
    readonly PostAttachment[],
    unknown,
    readonly PostAttachment[]
  >(
    queryKey,
    () =>
      apiQueryParams
        ? usePostAttachmentsGet(apiQueryParams)
        : failedQuery('Invalid uuids and ids. At least one must be defined'),
    {
      enabled,
      onSuccess: newPostAttachments => {
        queryClient.setQueriesData<readonly Post[] | undefined>(
          {
            queryKey: postsKeys.all,
            exact: false,
          },
          posts => {
            if (!posts) {
              // If the updater function receives undefined as input, you can return undefined to bail out of the update and thus not create a new cache entry. https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientsetquerydata
              return undefined;
            }

            return addPostAttachmentsToPosts(posts, newPostAttachments);
          },
        );
      },
    },
  );
};
