import { AxiosResponse } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getRequest } from 'store/request-builder';
import { isArray } from 'utils/utils';
import axios from '../../axios-instance';
import { postsKeys } from './posts.query-keys';
import {
  postAndAttachmentsApiToPostAndAttachments,
  transformPostApi,
} from './posts.transformations';
import {
  Post,
  PostCreateRequest,
  PostCreateRequestApi,
  PostCreateResult,
  PostCreateResultApi,
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
  const response = await axios.post<
    PostCreateResultApi,
    AxiosResponse<PostCreateResultApi>,
    PostCreateRequestApi
  >('http://192.168.1.217:5000/api/posts/0.1/posts/', {
    owner_id: ownerId,
    content,
    attachment_file_ids: attachmentFileIds,
  });

  const postWithAttachments = postAndAttachmentsApiToPostAndAttachments(
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
    ({ ownerId, content, attachmentFileIds }) =>
      postCreate({ ownerId, content, attachmentFileIds }),
    { onSuccess: onSuccessCallback },
  );
};
