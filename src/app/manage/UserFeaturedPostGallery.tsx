import { FC } from 'react';
import { FeaturerType } from 'store/features/features.types';
import { useUsersPostsFeaturesGetQuery } from 'store/users-posts-features/users-posts-features.queries';

interface UserFeaturedPostsGalleryProps {
  postOwnerId: number;
}

export const UserFeaturedPostGallery: FC<UserFeaturedPostsGalleryProps> = ({
  postOwnerId,
}) => {
  const {
    data: features,
    isLoading: featuresLoading,
    error: featuresError,
  } = useUsersPostsFeaturesGetQuery({
    queryParams: {
      postOwnerId: postOwnerId,
      featurerType: FeaturerType.USER,
    },
  });

  const postIds = features?.map(feature => {
    return feature.featuredEntityId;
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
