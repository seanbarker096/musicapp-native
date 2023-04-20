import { Gallery } from 'components/gallery';
import { FC } from 'react';
import { PostOwnerType } from 'store/posts';
import { useGetFeaturedPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface UserFeaturedPostsGalleryProps {
  postOwnerId: number;
  postOwnerType: PostOwnerType;
}

export const UserFeaturedPostGallery: FC<UserFeaturedPostsGalleryProps> = ({
  postOwnerId,
  postOwnerType,
}) => {
  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetFeaturedPostsWithAttachmentsAndFilesQuery({
      ownerId: postOwnerId,
      ownerType: postOwnerType,
      isFeaturedByUsers: true,
      isFeaturedByPerformers: false,
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
