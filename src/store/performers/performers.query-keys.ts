export const performersKeys = {
  all: ['performers'] as const,
  performersByIds: (performerIds: readonly number[]) =>
    [...performersKeys.all, ...performerIds] as const,
  performersByOwnerIds: (ownerIds: readonly number[]) =>
    [...performersKeys.all, ...ownerIds] as const,
  performersBySearchQuery: (searchQuery: string) =>
    [...performersKeys.all, 'searchQuery', searchQuery] as const,
  performerByUUID: (performerUUID: string) =>
    [...performersKeys.all, performerUUID] as const,
  null: [],
};
