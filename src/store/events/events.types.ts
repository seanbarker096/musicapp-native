import { StoreSlice } from 'store/store.types';

export interface EventsStoreSlice extends StoreSlice {
  Name: 'events';
  ObjectType: Event;
  Get: {
    RequestParametersType: EventsGetFilterApi;
    ResultType: EventsGetResultApi;
    ErrorType: {};
  };
  Post: never;
}

export interface EventApi {
  id: number;
  name: string;
  start_date: number;
  end_date: number;
  type: EventType;
  venue_name: string;
}

export interface Event {
  id: number;
  name: string;
  startDate: number;
  endDate: number;
  type: EventType;
  venueName: string;
}

export enum EventType {
  MUSIC_CONCERT = 'music_concert',
  MUSIC_FESTIVAL = 'music_festival',
}

export interface EventsGetFilterApi {
  ids: readonly number[];
}

export interface EventsGetResultApi {
  events: readonly EventApi[];
}
