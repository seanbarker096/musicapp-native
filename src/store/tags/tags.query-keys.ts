import { TaggedEntityType, TaggedInEntityType } from './tags.types';

export const tagKeys = {
  all: ['tags'] as const,
  performerTags: [
    'tags',
    'taggedEntityType',
    TaggedEntityType.PERFORMER,
  ] as const,
  tagsByTaggedEntity: (entityType: TaggedEntityType, entityId: number) =>
    [
      ...tagKeys.all,
      'taggedEntityType',
      entityType,
      'taggedEntityId',
      entityId,
    ] as const,
  tagsByTaggedInEntityAndTaggedEntityType: (
    taggedInEntityType: TaggedInEntityType,
    taggedInEntityId: number,
    taggedEntityType: TaggedEntityType,
  ) =>
    [
      ...tagKeys.all,
      'taggedEntityType',
      taggedEntityType,
      'taggedInEntityType',
      taggedInEntityType,
      'taggedInEntityId',
      taggedInEntityId,
    ] as const,
  tagsByTaggedEntityAndTaggedInEntityType: (
    taggedEntityType: TaggedEntityType,
    taggedEntityId: number,
    taggedInEntityType: TaggedInEntityType,
  ) =>
    [
      ...tagKeys.all,
      'taggedEntityType',
      taggedEntityType,
      'taggedEntityId',
      taggedEntityId,
      'taggedInEntityType',
      taggedInEntityType,
    ] as const,
  null: [],
};
