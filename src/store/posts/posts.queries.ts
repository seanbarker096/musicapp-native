import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getRequest, postRequest } from 'store/request-builder';
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
      'attachment_file_ids[]': attachmentFileIds,
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
