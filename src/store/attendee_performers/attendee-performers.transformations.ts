import { PerformerApi } from 'store/performers';
import { transformPerformerApi } from 'store/performers/performers.transformations';
import {
  AttendeePerformer,
  AttendeePerformersGetResultApi,
} from './attendee-performers.types';

export function transformAttendeePerformerApi(
  attendeePerformerApiGetResult: AttendeePerformersGetResultApi,
): readonly AttendeePerformer[] {
  const performers = attendeePerformerApiGetResult.performers;
  const counts = attendeePerformerApiGetResult.counts;

  const performersApiByPerformerIdMap: { [performerId: number]: PerformerApi } =
    {};

  performers.forEach(performer => {
    performersApiByPerformerIdMap[performer.id] = performer;
  });

  return counts.map(countItem => {
    const performer = transformPerformerApi(
      performersApiByPerformerIdMap[countItem.performer_id],
    );

    return {
      ...performer,
      count: countItem.count,
      attendeeId: countItem.attendee_id,
    };
  });
}
