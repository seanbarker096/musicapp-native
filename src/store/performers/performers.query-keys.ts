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
  null: (queryName: string) => [queryName, 'null'], // Null queries should still be unique, because if we resolve a promise when a query key is is null query key, all null query keys will resolve to this same value when we use that react-query hook. We might want to do this in cases such as when using a search query; if the search query is empty we return an empty array. All uses of this search query would then return a value of [] when defined, regardless of whether they are set to enabled. This also means the onSUccess callbacks will also run. See usePerformersSearchQuery as example.
};
