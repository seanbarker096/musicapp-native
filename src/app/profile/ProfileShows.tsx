import { ScrollableGallery } from 'components/gallery';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileShowsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
}

const ProfileShows: FC<ProfileShowsProps> = ({ profileId, profileType }) => {
  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetProfilePostsWithAttachmentsAndFilesQuery({
      profileId,
      profileType,
      includeFeatured: true,
      includeOwned: true,
      includeTagged: false,
    });

  return (
    <>
      {postsWithAttachmentsAndFiles && (
        <ScrollableGallery
          postsWithAttachmentsAndFiles={postsWithAttachmentsAndFiles}
          isLoading={postsLoading}
        ></ScrollableGallery>
      )}
    </>
  );
};

export default ProfileShows;
