export const filesKeys = {
  all: ['files'] as const,
  fileByUUID: (UUID: string | undefined) => [...filesKeys.all, UUID] as const,
  filesByUUIDs: (UUIDs: readonly string[]) =>
    [...filesKeys.all, UUIDs] as const,
  filesByIds: (ids: readonly number[]) => [...filesKeys.all, ids] as const,
  null: [],
};
