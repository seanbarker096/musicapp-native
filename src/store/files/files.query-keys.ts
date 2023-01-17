export const filesKeys = {
  all: ['files'] as const,
  fileByUUID: (UUID: string | undefined) => [...filesKeys.all, UUID] as const,
};
