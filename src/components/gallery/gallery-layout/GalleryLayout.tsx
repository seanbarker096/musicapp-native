import { Column } from 'components/column';
import { Grid } from 'components/grid';
import React, { FC } from 'react';
import { Post } from 'store/posts/posts.types';
import GalleryItem from '../gallery-item/GalleryItem';

interface GalleryLayoutProps {
  posts: readonly Post[];
}

const GalleryLayout: FC<GalleryLayoutProps> = ({ posts }) => (
  <Grid>
    {posts.map(post => (
      <Column
        key={post.id}
        columnWidth={4}
      >
        <GalleryItem post={post}></GalleryItem>
      </Column>
    ))}
  </Grid>
);

export default GalleryLayout;
