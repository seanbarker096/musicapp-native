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
      includeFeatured: true, // This should only return results for a performers profile, as they ar ethe only one that can feature posts (also known as 'Artist Picks')
      includeOwned: true, // Artists should not be able to create posts, so this filter should not return any additional results for a performers profile
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
