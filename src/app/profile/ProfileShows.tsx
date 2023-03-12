import { Gallery } from 'components/gallery';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileShowsProps {
  profileId: number; // Can be artist or user
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
        <Gallery
          postsWithAttachmentsAndFiles={postsWithAttachmentsAndFiles}
          isLoading={postsLoading}
        ></Gallery>
      )}
    </>
  );
};

export default ProfileShows;
