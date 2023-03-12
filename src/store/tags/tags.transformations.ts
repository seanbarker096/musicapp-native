import { Tag, TagApi } from './tags.types';

export function transformTagApi(tag: TagApi): Tag {
  return {
    id: tag.id,
    taggedEntityType: tag.tagged_entity_type,
    taggedEntityId: tag.tagged_entity_id,
    taggedInEntityType: tag.tagged_in_entity_type,
    taggedInEntityId: tag.tagged_in_entity_id,
    creatorId: tag.creator_id,
    createTime: tag.create_time,
  };
}
