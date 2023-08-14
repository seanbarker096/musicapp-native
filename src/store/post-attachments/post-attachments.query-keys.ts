export const postAttachmentsKeys = {
  all: ['postAttachments'] as const,
  postAttachmentsByPostId: (id: number | undefined) =>
    [...postAttachmentsKeys.all, id] as const,
  postAttachmentsByPostIds: (ids: readonly number[]) => [
    ...postAttachmentsKeys.all,
    ...ids,
  ],
  null: (queryName: string) => [queryName, 'null'],
};

export type PostAttachmentKeys =
  typeof postAttachmentsKeys[keyof typeof postAttachmentsKeys];
