import { ReactElement, memo } from 'react';
import { View } from 'react-native';
import { Post } from 'store/posts';
import { SPACING_XXXSMALL } from 'styles';

type props = {
  galleryItemFooter: (post: Post) => ReactElement;
  post: Post;
};

/**
 * A wrapper around galleryItem footer components.
 *
 * These components are defined in parent components via  render function. Therefore, we need to pass them through a
 * wrapper component to ensure that they are memoized correctly.
 */
export const MemoizedGalleryItemFooter: React.FC<props> = memo(
  ({ post, galleryItemFooter }) => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: SPACING_XXXSMALL / 2, // ensures the footer stays confined to the edges of the image, rather than hanging of its right edge
          right: SPACING_XXXSMALL / 2, // ensures the footer stays confined to the edges of the image, rather than hanging of its right edge
          width: '100%',
        }}
      >
        {galleryItemFooter(post)}
      </View>
    );
  },
);
