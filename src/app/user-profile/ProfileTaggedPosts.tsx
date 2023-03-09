import { Gallery } from 'components/gallery';
import React, { FC } from 'react';
import { PostOwnerType } from 'store/posts';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileTaggedPostsProps {
  profileId: number; // Can be artist or user
  postOwnerType: PostOwnerType;
}

const ProfileTaggedPosts: FC<ProfileTaggedPostsProps> = ({
  profileId,
  postOwnerType,
}) => {
  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetPostsWithAttachmentsAndFilesQuery({
      ownerId: profileId,
      ownerType: postOwnerType,
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

export default ProfileTaggedPosts;
