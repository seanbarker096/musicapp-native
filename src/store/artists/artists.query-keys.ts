export const artistsKeys = {
  all: ['artists'] as const,
  artistsBySearchQuery: (searchQuery: string) =>
    [...artistsKeys.all, searchQuery] as const,
};
