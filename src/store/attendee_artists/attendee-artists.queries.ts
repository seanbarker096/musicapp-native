// ------------------ ATTENDEE_ARTISTS_GET --------------------------- //

import { QueryKey, useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { attendeeArtistKeys } from './attendee-artists.query-keys';
import { transformAttendeeArtistApi } from './attendee-artists.transformations';
import {
  AttendeeArtistsGetFilterApi,
  AttendeeArtistsStoreSlice,
} from './attendee-artists.types';

async function attendeeArtistsGet({
  attendee_id,
  get_count,
}: AttendeeArtistsGetFilterApi) {
  const response = await getRequest<AttendeeArtistsStoreSlice>({
    url: `performers/0.1/attendees/${attendee_id}/artists}`,
    params: {
      get_count,
      attendee_id, // alreayd passed in the url, but sending it here avoids having to change the params type. This keeps the filter type consistent with the backend filter def
    },
  });

  return transformAttendeeArtistApi(response.data);
}

export function useAttendeeArtistsGetQuery({
  attendeeId,
  enabled = true,
}: {
  attendeeId: number;
  enabled?: boolean;
}) {
  let queryKey: QueryKey = attendeeArtistKeys.null;
  let apiQueryParams: AttendeeArtistsGetFilterApi | undefined;

  if (attendeeId) {
    queryKey = attendeeArtistKeys.attendeeArtistsByAttendeeId(attendeeId);
    apiQueryParams = {
      attendee_id: attendeeId,
      get_count: true,
    };
  }

  return useQuery(
    queryKey,
    () =>
      apiQueryParams
        ? attendeeArtistsGet(apiQueryParams)
        : failedQuery(
            `Invalid attendee-artists GET query params. Params: ${JSON.stringify(
              apiQueryParams,
            )}`,
          ),
    { enabled },
  );
}
