import { StoreSlice } from 'store/store.types';

export interface PerformancesStoreSlice extends StoreSlice {
  Name: 'performances';
  ObjectType: Performance;
  Get: {
    RequestParametersType: PerformancesGetFilterApi;
    ResultType: PerformancesGetResultApi;
    ErrorType: {};
  };
  Post: {
    RequestBodyType: PerformanceCreateRequestApi;
    ResultType: PerformanceCreateResultApi;
    ErrorType: {};
  };
}

export interface PerformanceApi {
  id: number;
  venue_id: number;
  performer_id: number;
  performance_date: number;
  create_time: number;
  update_time?: number;
}

export interface Performance {
  id: number;
  venueId: number;
  performerId: number;
  performanceDate: number;
  createTime: number;
  updateTime?: number;
}

export enum EventType {
  MUSIC_CONCERT = 'music_concert',
  MUSIC_FESTIVAL = 'music_festival',
}

export interface PerformancesGetFilterApi {
  ids?: readonly number[];
  performer_ids?: readonly number[];
  performance_date?: number;
  attendee_ids?: readonly number[];
}

export interface PerformancesGetResultApi {
  performances: readonly PerformanceApi[];
}

export interface PerformanceCreateRequestApi {
  performance_date: number;
  performer_id: number;
  venue_name: string;
  event_start_date: number;
  event_end_date: number;
  event_type: EventType;
}

/**
 * NOTE: This is different to the API PerformanceCreateRequest, which only includes fields to create the performance. Our frontend PerformanceCreateRequest type also includes event information, because our /performances/ POST api also handles creating the event.
 */
export interface PerformanceCreateRequest {
  performanceDate: number;
  performerId: number;
  venueName: string;
  eventStartDate: number;
  eventEndDate: number;
  eventType: EventType;
}

export interface PerformanceCreateResultApi {
  performance: PerformanceApi;
}