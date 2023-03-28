import {
  Performance,
  PerformanceApi,
} from 'store/performances/performances.types';
import { StoreSlice } from 'store/store.types';

export interface PerformancesCountsStoreSlice extends StoreSlice {
  Name: 'PerformancesCounts';
  ObjectType: PerformanceWithCounts;
  Get: {
    RequestParametersType: PerformancesCountsGetFilterApi;
    ResultType: PerformancesCountsGetResultApi;
    ErrorType: unknown;
  };
  Post: never;
  Search: never;
}

export interface PerformanceCountsApi {
  performance_id: number;
  attendee_count: number;
  tag_count: number;
  features_count: number;
}

export type PerformanceWithCounts = Performance & {
  attendeeCount: number;
  tagCount: number;
  featuresCount: number;
};

export interface PerformancesCountsGetResultApi {
  performances: readonly PerformanceApi[];
  counts: readonly PerformanceCountsApi[];
}

export interface PerformancesCountsGetResult {
  performances: readonly PerformanceWithCounts[];
}

export interface PerformancesCountsGetFilterApi {
  performance_ids: readonly number[];
  include_attendee_count?: boolean;
  include_tag_count?: boolean;
  include_features_count?: boolean;
}

// Enforce the counts to be defined on frontend, for stricter typing. They are optional on backend
export interface PerformancesCountsGetFilter {
  performanceIds: readonly number[];
  includeAttendeeCount: boolean;
  includeTagCount: boolean;
  includeFeaturesCount: boolean;
}

export interface PerformanceCountsGetFilter {
  performanceIds: readonly number[];
  includeAttendeeCount?: boolean;
  includeTagCount?: boolean;
  includeFeaturesCount?: boolean;
}
