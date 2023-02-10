import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { isArray } from 'utils/utils';
import axios from '../../axios-instance';
import { postsKeys } from './posts.query-keys';
import { transformPostApi } from './posts.transformations';
import { Post, PostCreateRequestApi, PostCreateResult, PostCreateResultApi, PostsStoreSlice } from './posts.types';

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


const postCreate = async({
    owner_id,
    content,
    attachment_file_ids
}: PostCreateRequestApi): Promise<PostCreateResult> {
  const response = await axios.post<PostCreateResultApi, AxiosResponse<PostCreateResultApi>, PostCreateRequestApi>(
    'http://192.168.1.217:5000/api/posts/0.1/posts/', {
      owner_id,
      content,
      attachment_file_ids
    }
  )

  const postWithAttachments = postsAndAttachmentsApiToPostsAndAttachments()
}

export const usePostCreateMutation = () => {

  const onSuccessCallback = async ({
   
  }) => {
   // invalidate relevant query keys
  };


  return useMutation(postCreate, {onSuccess: onSuccessCallback})
}
