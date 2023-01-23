import React, { FC } from 'react';
import { View } from 'react-native';
import { usePostsGetQuery } from 'store/posts';

interface GalleryProps {}

const Gallery: FC<GalleryProps> = () => {
  const { data } = usePostsGetQuery({ ownerId: 123 });
  console.log(data);
  // need to hack getting attachments. We dont want an actual data function
  // for this which amkes requests. Just want to hit cache
  return <View>test</View>;
};

export default Gallery;
