import { StoreSlice } from 'store/store.types';

export interface PerformancesStoreSlice extends StoreSlice {
  Name: 'performances';
  ObjectType: Performance;
  Get: {
    RequestParametersType: PerformancesGetFilterApi;
    ResultType: PerformancesGetResultApi;
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

export interface PerformancesGetFilterApi {
  ids: readonly number[];
  artist_ids: readonly number[];
  performance_dates: readonly number[];
}

export interface PerformancesGetResultApi {
  performances: readonly PerformanceApi[];
}
