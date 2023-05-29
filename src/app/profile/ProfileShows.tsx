import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileShowsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
  handlePostPress?: (postId: number) => void;
}

const ProfileShows: FC<ProfileShowsProps> = ({
  profileId,
  profileType,
  handlePostPress,
}) => {
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
          handleGalleryItemPress={handlePostPress}
        ></ScrollableGalleryLayout>
      )}
    </>
  );
};

export default ProfileShows;
