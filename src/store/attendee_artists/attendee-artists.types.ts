import { Artist, ArtistApi } from 'store/artists';
import { StoreSlice } from 'store/store.types';

export interface AttendeeArtistsStoreSlice extends StoreSlice {
  ObjectType: AttendeeArtist;
  Get: {
    RequestParametersType: AttendeeArtistsGetFilterApi;
    ResultType: AttendeeArtistsGetResultApi;
    ErrorType: {};
  };
  Post: never;
}

export interface AttendeeArtistsGetFilterApi {
  attendee_id: number;
  get_count: boolean;
  limit?: number;
}

export interface AttendeePerformersGetCountApi {
  count: number;
  performer_id: number;
  attendee_id: number;
}

export interface AttendeeArtistsGetResultApi {
  artists: readonly ArtistApi[];
  counts: readonly AttendeePerformersGetCountApi[];
}

/**
 * Identical to an Artist, but we also include the number of shows a user has attended.
 */
export type AttendeeArtist = Artist & { attendeeId: number; count: number };
