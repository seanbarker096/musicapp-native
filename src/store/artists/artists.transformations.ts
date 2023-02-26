import { ArtistSearchArtist, ArtistSearchArtistApi } from './artists.types';

export function transformArtistSearchArtistApi(
  artistSearchArtistApi: ArtistSearchArtistApi,
): ArtistSearchArtist {
  return {
    uuid: artistSearchArtistApi.uuid,
    name: artistSearchArtistApi.name,
    imageUrl: artistSearchArtistApi.image_url,
  };
}
