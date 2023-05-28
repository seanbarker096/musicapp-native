import ScrollableGalleryLayout from 'components/gallery/gallery-layout/ScrollableGalleryLayout';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileShowsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
}

const ProfileShows: FC<ProfileShowsProps> = ({ profileId, profileType }) => {
  const [limit, setLimit] = useState(9);

  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetProfilePostsWithAttachmentsAndFilesQuery({
      profileId,
      profileType,
      includeFeatured: true,
      includeOwned: true,
      includeTagged: false,
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

export default ProfileShows;
