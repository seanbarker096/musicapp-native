import { Gallery } from 'components/gallery';
import React, { FC } from 'react';
import { PostOwnerType } from 'store/posts';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileShowsProps {
  profileId: number; // Can be artist or user
  postOwnerType: PostOwnerType;
}

const ProfileShows: FC<ProfileShowsProps> = ({ profileId, postOwnerType }) => {
  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetPostsWithAttachmentsAndFilesQuery({
      ownerId: profileId,
      ownerType: postOwnerType, // TODO: Update this
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
