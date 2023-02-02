import React, { FC } from 'react';
import { Text } from 'react-native';
import { Post } from 'store/posts/posts.types';

interface GalleryItemProps {
  post: Post;
}

const GalleryItem: FC<GalleryItemProps> = ({ post }) => (
  <Text>Post content: {post.content}</Text>
);

export default GalleryItem;
