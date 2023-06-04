/* ----------- TAG CREATE ------------ */

import { QueryKey, useMutation, useQuery, useQueryClient } from 'react-query';
import { attendeePerformerKeys } from 'store/attendee-performers/attendee-performers.query-keys';
import { performancesKeys } from 'store/performances/performances.query-keys';
import { deleteRequest, getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { tagKeys } from './tags.query-keys';
import { transformTagApi } from './tags.transformations';
import {
  Tag,
  TagCreateRequest,
  TagDeleteRequest,
  TaggedEntityType,
  TaggedInEntityType,
  TagsStoreSlice,
} from './tags.types';

// ------------------ TAG CREATE ------------------ //
async function tagCreate({
  taggedEntityId,
  taggedEntityType,
  taggedInEntityId,
  taggedInEntityType,
}: TagCreateRequest) {
  const response = await postRequest<TagsStoreSlice>({
    url: 'tags/0.1/tags',
    body: {
      tagged_entity_type: taggedEntityType,
      tagged_entity_id: taggedEntityId,
      tagged_in_entity_type: taggedInEntityType,
      tagged_in_entity_id: taggedInEntityId,
    },
  });

  return transformTagApi(response.data.tag);
}

export const useTagCreateMutation = ({
  taggedInEntityId,
  taggedEntityType,
  taggedEntityId,
}: {
  taggedInEntityId?: number;
  taggedEntityType?: TaggedEntityType;
  taggedEntityId?: number;
} = {}) => {
  const queryClient = useQueryClient();

  const onSuccessCallback = async () => {
    // Be specific with invalidation if we can, otherwise invalidate all tags
    if (taggedInEntityId && taggedEntityType) {
      await queryClient.invalidateQueries(
        tagKeys.tagsByTaggedInEntityAndTaggedEntityType(
          TaggedInEntityType.POST, // Currently the only taggedInEntityType is POST
          taggedInEntityId,
          taggedEntityType,
        ),
      );
    }

    if (taggedEntityType === TaggedEntityType.PERFORMANCE) {
      // We have queries that only return tags if the resouce e.g. post is only tagged with a PERFORMER, and not a PERFORMANCE as well (e.g. ManageTaggedPost component). When we delete a tag on a PERFORMANCE (e.g. when unlinking a post to a performance) we therefore ned to invalidate some query keys to ensure the change is reflected elswhere in the app (e.g. ManageTaggedPost component).

      await queryClient.invalidateQueries(tagKeys.performerTags);
    }

    if (taggedEntityId && taggedEntityType === TaggedEntityType.PERFORMANCE) {
      // Ensure any lists showing performances a user has attended for the performer are updated
      await queryClient.invalidateQueries(
        // Invlidate all querys involving a performer id.
        performancesKeys.performancesByPerformerIds([]),
      );

      // An attendance to a performance is created when a PERFORMANCE is tagged in a post This ensures that any performance lists with attendance counts gets updated
      await queryClient.invalidateQueries(attendeePerformerKeys.all);
    }
    return;
  };

  return useMutation<Tag, any, TagCreateRequest>(
    (request: TagCreateRequest) => tagCreate(request),
    {
      onSuccess: onSuccessCallback,
    },
  );
};

// ------------------ TAG DELETE ------------------ //

async function tagsDelete({ id }: TagDeleteRequest) {
  const response = await deleteRequest<TagsStoreSlice>({
    url: 'tags/0.1/tags',
    params: {
      id,
    },
  });

  return response.data;
}

export const useTagDeleteMutation = ({
  taggedInEntityId,
  taggedEntityType,
  taggedEntityId,
}: {
  taggedInEntityId?: number;
  taggedEntityType?: TaggedEntityType;
  taggedEntityId?: number;
} = {}) => {
  const queryClient = useQueryClient();

  const onSuccessCallback = async () => {
    // Be specific with invalidation if we can, otherwise invalidate all tags
    if (taggedInEntityId && taggedEntityType) {
      await queryClient.invalidateQueries(
        tagKeys.tagsByTaggedInEntityAndTaggedEntityType(
          TaggedInEntityType.POST, // Currently the only taggedInEntityType is POST
          taggedInEntityId,
          taggedEntityType,
        ),
      );
    }

    if (taggedEntityType === TaggedEntityType.PERFORMANCE) {
      // If a post has been linked/unlinked to a performance via a tag creation/deletion, invalidate all tag queries. We have various queries fetching posts for a given performance by getting tags between them, or tags between a performer and posts (e.g. ManageTaggedPost component).
      await queryClient.invalidateQueries(tagKeys.all);
    }

    if (taggedEntityId && taggedEntityType === TaggedEntityType.PERFORMANCE) {
      // Ensure any lists showing performances a user has attended for the performer are updated
      await queryClient.invalidateQueries(
        // Invlidate all querys involving a performer id.
        performancesKeys.performancesByPerformerIds([]),
      );

      // An attendance to a performance is created when a PERFORMANCE is tagged in a post This ensures that any performance lists with attendance counts gets updated
      await queryClient.invalidateQueries(attendeePerformerKeys.all);
    }

    return;
  };

  return useMutation<void, any, TagDeleteRequest>(
    (request: TagDeleteRequest) => tagsDelete(request),
    {
      onSuccess: onSuccessCallback,
    },
  );
};

// ------------------ TAGS GET ------------------ //

type TagObjectFields = keyof TagsStoreSlice['ObjectType'];

export type TagsGetQueryField = Partial<{
  [key in TagObjectFields]:
    | TagsStoreSlice['ObjectType'][key]
    | readonly TagsStoreSlice['ObjectType'][key][];
}> & { onlySingleTaggedEntityType?: boolean };

async function tagsGet({
  tagged_entity_id,
  tagged_entity_type,
  tagged_in_entity_id,
  tagged_in_entity_type,
  only_single_tagged_entity_type,
}: TagsStoreSlice['Get']['RequestParametersType']) {
  const response = await getRequest<TagsStoreSlice>({
    url: 'tags/0.1/tags',
    params: {
      tagged_entity_type,
      tagged_entity_id,
      tagged_in_entity_id,
      tagged_in_entity_type,
      only_single_tagged_entity_type,
    },
  });

  return response.data.tags.map(tag => transformTagApi(tag));
}

export function useTagsGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: TagsGetQueryField;
  enabled?: boolean;
}) {
  const {
    taggedEntityId,
    taggedEntityType,
    taggedInEntityId,
    taggedInEntityType,
    onlySingleTaggedEntityType,
  } = queryParams;

  let apiQueryParams:
    | TagsStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = tagKeys.null;

  if (taggedEntityId && taggedEntityType) {
    if (isArray(taggedEntityId) || isArray(taggedEntityType)) {
      throw Error(
        `Invalid query prarms for tags GET. Currently only getting tags for a single tagged entity is supported. Request: ${JSON.stringify(
          queryParams,
        )}`,
      );
    }

    apiQueryParams = {
      tagged_entity_id: taggedEntityId,
      tagged_entity_type: taggedEntityType,
    };

    queryKey = tagKeys.tagsByTaggedEntity(taggedEntityType, taggedEntityId);
  }

  if (taggedEntityType && taggedEntityId && taggedInEntityType) {
    if (
      isArray(taggedEntityType) ||
      isArray(taggedEntityId) ||
      isArray(taggedInEntityType)
    ) {
      throw Error(
        `Invalid query prarms for tags GET. Currently only getting tags for a single tagged entity is supported. Request: ${JSON.stringify(
          queryParams,
        )}`,
      );
    }
    apiQueryParams = {
      tagged_entity_id: taggedEntityId,
      tagged_entity_type: taggedEntityType,
      tagged_in_entity_type: taggedInEntityType,
    };

    queryKey = tagKeys.tagsByTaggedEntityAndTaggedInEntityType(
      taggedEntityType,
      taggedEntityId,
      taggedInEntityType,
    );
  }

  if (taggedInEntityId && taggedInEntityType && taggedEntityType) {
    if (
      isArray(taggedInEntityId) ||
      isArray(taggedInEntityType) ||
      isArray(taggedEntityType)
    ) {
      throw Error(
        `Invalid query prarms for tags GET. Currently only getting tags for a single tagged entity is supported. Request: ${JSON.stringify(
          queryParams,
        )}`,
      );
    }

    apiQueryParams = {
      tagged_in_entity_id: taggedInEntityId,
      tagged_in_entity_type: taggedInEntityType,
      tagged_entity_type: taggedEntityType,
    };

    queryKey = tagKeys.tagsByTaggedInEntityAndTaggedEntityType(
      taggedInEntityType,
      taggedInEntityId,
      taggedEntityType,
    );
  }

  // If main query params defined by now due to main filter fields being provided, add only_single_tagged_entity_type
  if (onlySingleTaggedEntityType && apiQueryParams) {
    apiQueryParams = {
      ...apiQueryParams,
      only_single_tagged_entity_type: onlySingleTaggedEntityType,
    };
  }

  return useQuery(
    queryKey,
    () =>
      apiQueryParams
        ? tagsGet(apiQueryParams)
        : failedQuery(
            `Invalid query params for tags GET. ${JSON.stringify(
              apiQueryParams,
            )}`,
          ),
    {
      enabled,
    },
  );
}