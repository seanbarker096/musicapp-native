export const attendeeArtistKeys = {
  all: ['attendeeArtists'] as const,
  attendeeArtistsByAttendeeId: (attendeeId: number) =>
    [...attendeeArtistKeys.all, 'attendeeId', attendeeId] as const,
  null: [],
};
