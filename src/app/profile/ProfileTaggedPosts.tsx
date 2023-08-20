import { AppEmptyState } from 'components/app-empty-state';
import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
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

  const { profileState } = useContext(ProfileContext);
  const {
    profileId: viewingUserProfileId,
    profileType: viewingUserProfileType,
  } = profileState;

  const isViewingUserProfile =
    viewingUserProfileId === profileId &&
    viewingUserProfileType === profileType;

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
      {postsWithAttachmentsAndFiles &&
        !postsWithAttachmentsAndFiles.length &&
        !isViewingUserProfile && (
          <AppEmptyState
            primaryMessage="Videos of the artist's gigs"
            secondaryMessage="When fans upload videos from this aritst's gigs, they'll appear here"
          ></AppEmptyState>
        )}
      {postsWithAttachmentsAndFiles &&
        !postsWithAttachmentsAndFiles.length &&
        isViewingUserProfile && (
          <AppEmptyState
            primaryMessage="Your favourite videos captured by your fans"
            secondaryMessage="When fans upload videos from this aritst's gigs, they'll appear here"
          ></AppEmptyState>
        )}
    </>
  );
};

export default ProfileTaggedPosts;
