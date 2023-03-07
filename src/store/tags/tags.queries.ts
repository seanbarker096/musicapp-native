/* ----------- TAG CREATE ------------ */

import { useMutation } from 'react-query';
import { postRequest } from 'store/request-builder';
import { transformTagApi } from './tags.transformations';
import { Tag, TagCreateRequest, TagsStoreSlice } from './tags.types';

async function tagCreate({
  taggedEntityId,
  taggedEntityType,
  taggedInEntityId,
  taggedInEntityType,
  creatorId,
  creatorType,
}: TagCreateRequest) {
  const response = await postRequest<TagsStoreSlice>({
    url: 'tags/0.1/tags',
    body: {
      tagged_entity_type: taggedEntityType,
      tagged_entity_id: taggedEntityId,
      tagged_in_entity_type: taggedInEntityType,
      tagged_in_entity_id: taggedInEntityId,
      creator_type: creatorType,
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
