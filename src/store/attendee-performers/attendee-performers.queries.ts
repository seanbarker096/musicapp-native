// ------------------ ATTENDEE_PERFORMERS_GET --------------------------- //

import { QueryKey, useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { attendeePerformerKeys } from './attendee-performers.query-keys';
import { transformAttendeePerformerApi } from './attendee-performers.transformations';
import {
  AttendeePerformersGetFilterApi,
  AttendeePerformersStoreSlice,
} from './attendee-performers.types';

async function attendeePerformersGet({
  attendee_id,
  get_count,
}: AttendeePerformersGetFilterApi) {
  const response = await getRequest<AttendeePerformersStoreSlice>({
    url: `performers/0.1/attendees/${attendee_id}/performers}`,
    params: {
      get_count,
      attendee_id, // alreayd passed in the url, but sending it here avoids having to change the params type. This keeps the filter type consistent with the backend filter def
    },
  });

  return transformAttendeePerformerApi(response.data);
}

export function useAttendeePerformersGetQuery({
  attendeeId,
  enabled = true,
}: {
  attendeeId: number;
  enabled?: boolean;
}) {
  let queryKey: QueryKey = attendeePerformerKeys.null;
  let apiQueryParams: AttendeePerformersGetFilterApi | undefined;

  if (attendeeId) {
    queryKey = attendeePerformerKeys.attendeePerformersByAttendeeId(attendeeId);
    apiQueryParams = {
      attendee_id: attendeeId,
      get_count: true,
    };
  }

  return useQuery(
    queryKey,
    () =>
      apiQueryParams
        ? attendeePerformersGet(apiQueryParams)
        : failedQuery(
            `Invalid attendee-performers GET query params. Params: ${JSON.stringify(
              apiQueryParams,
            )}`,
          ),
    { enabled },
  );
}
