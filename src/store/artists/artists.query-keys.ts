export const artistsKeys = {
  all: ['artists'] as const,
  artistsByIds: (artistIds: readonly number[]) =>
    [...artistsKeys.all, ...artistIds] as const,
  artistsBySearchQuery: (searchQuery: string) =>
    [...artistsKeys.all, searchQuery] as const,
  artistByUUID: (artistUUID: string) =>
    [...artistsKeys.all, artistUUID] as const,
  null: [],
};
