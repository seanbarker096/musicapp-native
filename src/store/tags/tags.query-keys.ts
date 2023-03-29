import { TaggedEntityType } from './tags.types';

export const tagKeys = {
  tags: ['tags'] as const,
  tagsByEntityTypesAndIds: (entityType: TaggedEntityType, entityId: number) =>
    ['tags', 'entityType', entityType, 'entityId', entityId] as const,
  null: [],
};
