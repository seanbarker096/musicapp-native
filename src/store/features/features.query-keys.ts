export const featuresKeys = {
  all: ['features'] as const,
  postFeaturesByArtistId: (artistId: number) => [
    'features',
    'posts',
    'artists',
    artistId,
  ],
  null: [],
};
