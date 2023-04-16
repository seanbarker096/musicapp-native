/* ----------- TAG CREATE ------------ */

import { QueryKey, useMutation, useQuery } from 'react-query';
import { getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { tagKeys } from './tags.query-keys';
import { transformTagApi } from './tags.transformations';
import { Tag, TagCreateRequest, TagsStoreSlice } from './tags.types';

async function tagCreate({
  taggedEntityId,
  taggedEntityType,
  taggedInEntityId,
  taggedInEntityType,
  creatorId,
}: TagCreateRequest) {
  const response = await postRequest<TagsStoreSlice>({
    url: 'tags/0.1/tags',
    body: {
      tagged_entity_type: taggedEntityType,
      tagged_entity_id: taggedEntityId,
      tagged_in_entity_type: taggedInEntityType,
      tagged_in_entity_id: taggedInEntityId,
      creator_id: creatorId,
    },
  });

  return transformTagApi(response.data.tag);
}

export const useTagCreateMutation = () => {
  return useMutation<Tag, any, TagCreateRequest>((request: TagCreateRequest) =>
    tagCreate(request),
  );
};

// ------------------ TAGS GET ------------------ //

type TagObjectFields = keyof TagsStoreSlice['ObjectType'];

export type TagsGetQueryField = Partial<{
  [key in TagObjectFields]:
    | TagsStoreSlice['ObjectType'][key]
    | readonly TagsStoreSlice['ObjectType'][key][];
}>;

async function tagsGet({
  tagged_entity_id,
  tagged_entity_type,
}: TagsStoreSlice['Get']['RequestParametersType']) {
  const response = await getRequest<TagsStoreSlice>({
    url: 'tags/0.1/tags',
    params: {
      tagged_entity_type,
      tagged_entity_id,
    },
  });

  return response.data.tags.map(tag => transformTagApi(tag));
};

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

    queryKey = tagKeys.tagsByEntityTypesAndIds(
      taggedEntityType,
      taggedEntityId,
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