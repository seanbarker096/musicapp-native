import { Performer, PerformerApi } from 'store/performers';
import { StoreSlice } from 'store/store.types';

export interface AttendeePerformersStoreSlice extends StoreSlice {
  ObjectType: AttendeePerformer;
  Get: {
    RequestParametersType: AttendeePerformersGetFilterApi;
    ResultType: AttendeePerformersGetResultApi;
    ErrorType: {};
  };
  Post: never;
}

export interface AttendeePerformersGetFilterApi {
  attendee_id: number;
  get_count: boolean;
  limit?: number;
}

export interface AttendeePerformersGetCountApi {
  count: number;
  performer_id: number;
  attendee_id: number;
}

export interface AttendeePerformersGetResultApi {
  performers: readonly PerformerApi[];
  counts: readonly AttendeePerformersGetCountApi[];
}

/**
 * Identical to an Performer, but we also include the number of shows a user has attended.
 */
export type AttendeePerformer = Performer & {
  attendeeId: number;
  count: number;
};
