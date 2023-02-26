import {
  Artist,
  ArtistApi,
  ArtistSearchArtist,
  ArtistSearchArtistApi,
} from './artists.types';

export function transformArtistSearchArtistApi(
  artistSearchArtistApi: ArtistSearchArtistApi,
): ArtistSearchArtist {
  return {
    uuid: artistSearchArtistApi.uuid,
    name: artistSearchArtistApi.name,
    imageUrl: artistSearchArtistApi.image_url,
  };
}

export function transformArtistApi(artistApi: ArtistApi): Artist {
  return {
    id: artistApi.id,
    uuid: artistApi.uuid,
    name: artistApi.name,
    biography: artistApi.biography,
    createTime: artistApi.create_time,
    updateTime: artistApi.update_time,
    ownerId: artistApi.owner_id,
    imageUrl: artistApi.image_url,
  };
}
