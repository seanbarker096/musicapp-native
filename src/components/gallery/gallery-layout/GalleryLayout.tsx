import { Column } from 'components/column';
import { Grid } from 'components/grid';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Post } from 'store/posts/posts.types';
import { SPACING_XXSMALL } from 'styles';
import GalleryItem from '../gallery-item/GalleryItem';

interface GalleryLayoutProps {
  posts: readonly Post[];
}

const GalleryLayout: FC<GalleryLayoutProps> = ({ posts }) => (
  <Grid gridPadding={styles.gridPadding}>
    {posts.map(post => (
      <Column
        key={post.id}
        columnWidth={4}
      >
        <GalleryItem
          galleryItemStyles={styles.item}
          post={post}
        ></GalleryItem>
      </Column>
    ))}
  </Grid>
);

export default GalleryLayout;

const styles = StyleSheet.create({
  item: {
    marginBottom: SPACING_XXSMALL / 2,
    marginRight: SPACING_XXSMALL / 2,
    marginTop: 0,
    maringLeft: SPACING_XXSMALL / 2,
  },
  gridPadding: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: SPACING_XXSMALL / 2,
    paddingRight: SPACING_XXSMALL / 2,
  },
});
