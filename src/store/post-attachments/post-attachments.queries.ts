import { QueryKey, useQuery } from 'react-query';
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
): Promise<readonly PostAttachmentsStoreSlice['ObjectType'][]> {
  const response = await getRequest<PostAttachmentsStoreSlice>({
    url: 'posts/0.1/attachments',
    params,
  });

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
  const { postId } = queryParams;

  let apiQueryParams:
    | PostAttachmentsStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = postAttachmentsKeys.null;

  if (postId) {
    apiQueryParams = {};
    const processedPostId = isArray(postId) ? postId : [postId];

    apiQueryParams['post_ids'] = processedPostId;
    queryKey = postAttachmentsKeys.postAttachmentsByPostIds(processedPostId);
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
    },
  );
};
