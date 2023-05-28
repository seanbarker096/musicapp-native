import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileTaggedPostsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
}

const ProfileTaggedPosts: FC<ProfileTaggedPostsProps> = ({
  profileId,
  profileType,
}) => {
  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetProfilePostsWithAttachmentsAndFilesQuery({
      profileId,
      profileType,
      includeFeatured: false,
      includeOwned: false,
      includeTagged: true,
    });

  return (
    <>
      {postsWithAttachmentsAndFiles && (
        <ScrollableGalleryLayout
          posts={postsWithAttachmentsAndFiles}
        ></ScrollableGalleryLayout>
      )}
    </>
  );
};

export default ProfileTaggedPosts;
