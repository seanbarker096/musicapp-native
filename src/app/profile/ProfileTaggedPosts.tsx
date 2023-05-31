import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileTaggedPostsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
  handleTaggedPostPress: (postId: number) => void;
}

const ProfileTaggedPosts: FC<ProfileTaggedPostsProps> = ({
  profileId,
  profileType,
  handleTaggedPostPress,
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
      {postsWithAttachmentsAndFiles &&
        !!postsWithAttachmentsAndFiles.length && (
          <ScrollableGalleryLayout
            posts={postsWithAttachmentsAndFiles}
            onEndReached={() => {
              if (hasNextPage) {
                setLimit(limit + 9);
              }
            }}
            hasMoreData={hasNextPage}
            handleGalleryItemPress={handleTaggedPostPress}
          ></ScrollableGalleryLayout>
        )}
      {postsWithAttachmentsAndFiles && !postsWithAttachmentsAndFiles.length && (
        <AppText>No posts here</AppText>
      )}
    </>
  );
};

export default ProfileTaggedPosts;
