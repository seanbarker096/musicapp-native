import { QueryKey, useMutation, useQuery, useQueryClient } from 'react-query';
import { getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { postsKeys } from './posts.query-keys';
import {
  transformPostAndAttachmentsApi,
  transformPostApi,
} from './posts.transformations';
import {
  Post,
  PostCreateRequest,
  PostCreateResult,
  PostsStoreSlice,
} from './posts.types';

type PostObjectFields = keyof PostsStoreSlice['ObjectType'];

/** -------------- POSTS GET ------------------ */
export type PostsGetQueryField = Partial<{
  [key in PostObjectFields]:
    | PostsStoreSlice['ObjectType'][key]
    | readonly PostsStoreSlice['ObjectType'][key][];
}>;

const postsGet = async (
  params: PostsStoreSlice['Get']['RequestParametersType'],
) => {
  const response = await getRequest<PostsStoreSlice>({
    url: 'posts/0.1/posts',
    params: {
      owner_ids: params.owner_ids,
      ids: params.ids,
    },
  });

  const postsAndAttachments = response.data;

  return postsAndAttachments.posts.map(post => transformPostApi(post));
};

export const usePostsGetQuery = ({ ownerId, id }: PostsGetQueryField) => {
  let apiQueryParams:
    | PostsStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = postsKeys.null;

  if (ownerId) {
    const processedOwnerId = isArray(ownerId) ? ownerId : [ownerId];
    apiQueryParams = { owner_ids: processedOwnerId };
    queryKey = postsKeys.postsByOwnerIds(processedOwnerId);
  }

  if (id) {
    const processedPostId = isArray(id) ? id : [id];
    apiQueryParams = { ids: processedPostId };
    queryKey = postsKeys.postsByIds(processedPostId);
  }

  return useQuery<readonly Post[], unknown, readonly Post[]>(queryKey, () =>
    apiQueryParams
      ? postsGet(apiQueryParams)
      : failedQuery(
          `Invalid Posts get query params or unsupported query. Query: ${JSON.stringify(
            apiQueryParams,
          )}`,
        ),
  );
};

/** ------------------- POST CREATE ---------------------- */

const postCreate = async function ({
  ownerId,
  content,
  attachmentFileIds,
}: PostCreateRequest): Promise<PostCreateResult> {
  if (attachmentFileIds.length === 0) {
    throw Error(
      'Must provide at least one  attachment id when creating a post',
    );
  }

  const response = await postRequest<PostsStoreSlice>({
    url: 'posts/0.1/posts/',
    body: {
      owner_id: ownerId,
      content,
      attachment_file_ids: attachmentFileIds,
    },
  });

  const postWithAttachments = transformPostAndAttachmentsApi(
    response.data.post,
    response.data.attachments,
  );

  return postWithAttachments;
};

export const usePostCreateMutation = ({
  ownerId: userId,
}: {
  ownerId: number;
}) => {
  const queryClient = useQueryClient();
  const onSuccessCallback = async () => {
    // invalidate relevant query keys
    // return the promise to mutation is still loading until queries invalidated
    return queryClient.invalidateQueries(postsKeys.postsByOwnerIds([userId]));
  };

  return useMutation<PostCreateResult, any, PostCreateRequest>(
    ({ ownerId, content, attachmentFileIds }: PostCreateRequest) =>
      postCreate({ ownerId, content, attachmentFileIds }),
    { onSuccess: onSuccessCallback },
  );
};
