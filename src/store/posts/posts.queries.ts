import { ProfileType } from 'contexts/profile.context';
import { QueryKey, useMutation, useQuery, useQueryClient } from 'react-query';
import { attendeePerformerKeys } from 'store/attendee-performers/attendee-performers.query-keys';
import { profilePostsKeys } from 'store/profile-posts/profile-posts.query-keys';
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
  PostOwnerType,
  PostsStoreSlice,
} from './posts.types';

type PostObjectFields = keyof PostsStoreSlice['ObjectType'];

/** -------------- POSTS GET ------------------ */
export type PostsGetQueryField = Partial<{
  [key in PostObjectFields]:
    | PostsStoreSlice['ObjectType'][key]
    | readonly PostsStoreSlice['ObjectType'][key][];
}> & { limit?: number };

const postsGet = async ({
  owner_ids,
  owner_types,
  ids,
  limit = 9,
}: PostsStoreSlice['Get']['RequestParametersType']) => {
  const response = await getRequest<PostsStoreSlice>({
    url: 'posts/0.1/posts',
    params: {
      owner_ids,
      owner_types,
      ids,
      limit,
    },
  });

  const postsAndAttachments = response.data;

  return postsAndAttachments.posts.map(post => transformPostApi(post));
};

export const usePostsGetQuery = ({
  queryParams: { ownerId, id, ownerType, limit = 9 },
  enabled = true,
}: {
  queryParams: PostsGetQueryField;
  enabled: boolean;
}) => {
  let apiQueryParams:
    | PostsStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = postsKeys.null;

  if (ownerId && ownerType) {
    const processedOwnerId = isArray(ownerId) ? ownerId : [ownerId];
    const processedOwnerType = isArray(ownerType) ? ownerType : [ownerType];

    apiQueryParams = {
      owner_ids: processedOwnerId,
      owner_types: processedOwnerType,
      limit,
    };

    queryKey =
      !isArray(ownerId) && !isArray(ownerType)
        ? postsKeys.postsByOwner(ownerId, ownerType, limit)
        : postsKeys.postsByOwnerIds(processedOwnerId, limit);
  }

  if (id) {
    const processedPostId = isArray(id) ? id : [id];
    apiQueryParams = { ids: processedPostId };
    queryKey = postsKeys.postsByIds(processedPostId);
  }

  return useQuery<readonly Post[], unknown, readonly Post[]>(
    queryKey,
    () =>
      apiQueryParams
        ? postsGet(apiQueryParams)
        : failedQuery(
            `Invalid Posts get query params or unsupported query. Query: ${JSON.stringify(
              apiQueryParams,
            )}`,
          ),
    {
      enabled,
    },
  );
};

/** ------------------- POST CREATE ---------------------- */

const postCreate = async function ({
  ownerId,
  ownerType,
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
      owner_type: ownerType,
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
  ownerId,
  ownerType,
  queryKeysToInvalidate,
}: {
  ownerId: number;
  ownerType: PostOwnerType;
  queryKeysToInvalidate?: QueryKey[];
}) => {
  const queryClient = useQueryClient();
  const onSuccessCallback = async () => {
    // invalidate relevant query keys
    // return the promise to mutation is still loading until queries invalidated

    // Invalidate requests that fetch posts by the new post's owner (e.g. when showing their gallery)
    await queryClient.invalidateQueries(postsKeys.postsByOwnerIds([ownerId]));

    // Invalidate requests that list the artists the post owner has seen, in case they create a post about a new artist
    await queryClient.invalidateQueries(
      attendeePerformerKeys.attendeePerformersByAttendeeId(ownerId),
    );

    // Invalidate any query keys which required data we didn't have when calling usePostCreateMutation
    if (queryKeysToInvalidate) {
      const promises = queryKeysToInvalidate?.map(key =>
        queryClient.invalidateQueries(key),
      );

      await Promise.all(promises);
    }

    // TODO: Might also need to invalidate all profile post queries for the performer tagged in the post

    // Invalidate queries used to fetch profile posts, so the new post appears in their gallery when navigating back to it
    const profileType =
      ownerType === PostOwnerType.PERFORMER
        ? ProfileType.PERFORMER
        : ProfileType.USER;

    return queryClient.invalidateQueries(
      profilePostsKeys.profilePostsByProfile(ownerId, profileType),
    );
  };

  return useMutation<PostCreateResult, any, PostCreateRequest>(
    (request: PostCreateRequest) => postCreate(request),
    { onSuccess: onSuccessCallback },
  );
};
