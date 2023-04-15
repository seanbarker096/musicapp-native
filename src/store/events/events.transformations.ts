import { Event, EventApi } from './events.types';

export function transformEventApi(event: EventApi): Event {
  return {
    id: event.id,
    name: event.name,
    startDate: event.start_date,
    endDate: event.end_date,
    type: event.type,
    venueName: event.venue_name,
  };
}
