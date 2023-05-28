import { Column } from 'components/column';
import { Grid } from 'components/grid';
import React, { FC, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { Post } from 'store/posts/posts.types';
import { SPACING_XXSMALL } from 'styles';
import { isPostWithFile } from 'utils/utils';
import GalleryItem from '../gallery-item/GalleryItem';
import { MemoizedGalleryItemFooter } from '../gallery-item/MemoizedGalleryItemFooter';

interface GalleryLayoutProps {
  posts: readonly Post[];
  /**
   * A function that returns a ReactElement to be rendered as the footer of each gallery item.
   */
  galleryItemFooter?: (post: Post) => ReactElement;
}

const GalleryLayout: FC<GalleryLayoutProps> = ({
  posts,
  galleryItemFooter,
}) => {
  return (
    <Grid gridPadding={styles.gridPadding}>
      {posts.filter(isPostWithFile).map(post => (
        <Column
          key={post.id}
          columnWidth={4}
        >
          <GalleryItem
            galleryItemStyles={{ ...styles.item, position: 'relative' }}
            postId={post.id}
            fileUrl={
              (post.attachments &&
                post.attachments[0] &&
                post.attachments[0].file?.url) as string
            } // We know that is defined due to isPostWithFile check above
          ></GalleryItem>
          {galleryItemFooter && (
            <MemoizedGalleryItemFooter
              post={post}
              galleryItemFooter={galleryItemFooter}
            />
          )}
        </Column>
      ))}
    </Grid>
  );
};

export default GalleryLayout;

const styles = StyleSheet.create({
  item: {
    marginBottom: SPACING_XXSMALL / 2,
    marginRight: SPACING_XXSMALL / 2,
    marginTop: 0,
    marginLeft: 0,
  },
  gridPadding: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: SPACING_XXSMALL / 2,
    paddingRight: SPACING_XXSMALL / 2,
  },
});
