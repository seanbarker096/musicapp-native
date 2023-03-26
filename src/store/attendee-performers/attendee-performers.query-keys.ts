export const attendeePerformerKeys = {
  all: ['attendeePerformers'] as const,
  attendeePerformersByAttendeeId: (attendeeId: number) =>
    [...attendeePerformerKeys.all, 'attendeeId', attendeeId] as const,
  null: [],
};
