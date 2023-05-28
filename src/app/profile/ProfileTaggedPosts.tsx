import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileTaggedPostsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
}

const ProfileTaggedPosts: FC<ProfileTaggedPostsProps> = ({
  profileId,
  profileType,
}) => {
  const [limit, setLimit] = useState(9);

  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetProfilePostsWithAttachmentsAndFilesQuery({
      profileId,
      profileType,
      includeFeatured: false,
      includeOwned: false,
      includeTagged: true,
      limit,
    });

  const hasNextPage = postsWithAttachmentsAndFiles
    ? postsWithAttachmentsAndFiles.length >= limit
    : false;

  return (
    <>
      {postsWithAttachmentsAndFiles && (
        <ScrollableGalleryLayout
          posts={postsWithAttachmentsAndFiles}
          onEndReached={() => {
            if (hasNextPage) {
              setLimit(limit + 9);
            }
          }}
          hasMoreData={hasNextPage}
        ></ScrollableGalleryLayout>
      )}
    </>
  );
};

export default ProfileTaggedPosts;
