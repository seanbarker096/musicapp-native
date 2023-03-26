import { ArtistApi } from 'store/artists';
import { transformArtistApi } from 'store/artists/artists.transformations';
import {
  AttendeeArtist,
  AttendeeArtistsGetResultApi,
} from './attendee-artists.types';

export function transformAttendeeArtistApi(
  attendeeArtistApiGetResult: AttendeeArtistsGetResultApi,
): readonly AttendeeArtist[] {
  const artists = attendeeArtistApiGetResult.artists;
  const counts = attendeeArtistApiGetResult.counts;

  const artistsApiByArtistIdMap: { [artistId: number]: ArtistApi } = {};

  artists.forEach(artist => {
    artistsApiByArtistIdMap[artist.id] = artist;
  });

  return counts.map(countItem => {
    const artist = transformArtistApi(
      artistsApiByArtistIdMap[countItem.performer_id],
    );

    return {
      ...artist,
      count: countItem.count,
      attendeeId: countItem.attendee_id,
    };
  });
}
