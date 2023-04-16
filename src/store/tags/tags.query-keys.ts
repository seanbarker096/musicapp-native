import { TaggedEntityType, TaggedInEntityType } from './tags.types';

export const tagKeys = {
  tags: ['tags'] as const,
  tagsByEntityTypesAndIds: (entityType: TaggedEntityType, entityId: number) =>
    ['tags', 'entityType', entityType, 'entityId', entityId] as const,
  null: [],
  tagsByTaggedInEntityAndTaggedEntityType: (
    taggedInEntityType: TaggedInEntityType,
    taggedInEntityId: number,
    taggedEntityType: TaggedEntityType,
  ) =>
    [
      'tags',
      'taggedInEntityType',
      taggedInEntityType,
      'taggedInEntityId',
      taggedInEntityId,
      'taggedEntityType',
      taggedEntityType,
    ] as const,
};
