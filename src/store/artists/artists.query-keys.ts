export const artistsKeys = {
  all: ['artists'] as const,
  artistsBySearchQuery: (searchQuery: string) =>
    [...artistsKeys.all, searchQuery] as const,
  artist: (artistUUID: string) => [...artistsKeys.all, artistUUID] as const,
};
