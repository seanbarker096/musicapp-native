import { Column } from 'components/column';
import { Grid } from 'components/grid';
import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Post } from 'store/posts/posts.types';
import { SPACING_XXSMALL } from 'styles';
import { isDefined } from 'utils/utils';
import GalleryItem from '../gallery-item/GalleryItem';

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
      {posts.map(post => (
        <Column
          key={post.id}
          columnWidth={4}
        >
          <GalleryItem
            galleryItemStyles={{ ...styles.item, position: 'relative' }}
            post={post}
          ></GalleryItem>
          {isDefined(galleryItemFooter) && galleryItemFooter && (
            <View
              style={{
                position: 'absolute',
                bottom: SPACING_XXSMALL / 2, // ensures the footer stays confined to the edges of the image, rather than hanging of its right edge
                right: SPACING_XXSMALL / 2, // ensures the footer stays confined to the edges of the image, rather than hanging of its right edge
                width: '100%',
              }}
            >
              {galleryItemFooter(post)}
            </View>
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
