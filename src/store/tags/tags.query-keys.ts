import { TaggedEntityType, TaggedInEntityType } from './tags.types';

export const tagKeys = {
  all: ['tags'] as const,
  tagsByEntityTypesAndIds: (entityType: TaggedEntityType, entityId: number) =>
    [
      'tags',
      'taggedEntityType',
      entityType,
      'taggedEntityId',
      entityId,
    ] as const,
  null: [],
  tagsByTaggedInEntityAndTaggedEntityType: (
    taggedInEntityType: TaggedInEntityType,
    taggedInEntityId: number,
    taggedEntityType: TaggedEntityType,
  ) =>
    [
      'tags',
      'taggedEntityType',
      taggedEntityType,
      'taggedInEntityType',
      taggedInEntityType,
      'taggedInEntityId',
      taggedInEntityId,
    ] as const,
};
