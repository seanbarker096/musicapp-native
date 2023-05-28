import { Row } from 'components/row';
import React, { FC, ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { Post } from 'store/posts/posts.types';
import { SPACING_XXSMALL } from 'styles';
import { isDefined, isPostWithFile } from 'utils/utils';
import GalleryItem from '../gallery-item/GalleryItem';

interface GalleryLayoutProps {
  posts: readonly Post[];
  /**
   * A function that returns a ReactElement to be rendered as the footer of each gallery item.
   */
  galleryItemFooter?: (post: Post) => ReactElement;
  onEndReached?: () => void;
  hasMoreData?: boolean;
}

const ScrollableGalleryLayout: FC<GalleryLayoutProps> = ({
  posts,
  galleryItemFooter,
  onEndReached,
  hasMoreData,
}) => {
  const arrangedPosts: Post[][] = [];
  // map over posts and put them into a lis of nested arrays, with with post per array

  posts.forEach((post, index) => {
    const i = Math.floor(index / 3);

    if (!arrangedPosts[i]) {
      arrangedPosts[i] = [];
    }

    arrangedPosts[i].push(post);
  });

  const listItem = ({ item, index }: ListRenderItemInfo<Post[]>) => {
    return (
      <Row
        key={index}
        maxItems={3}
      >
        {item.filter(isPostWithFile).map(post => (
          <View key={post.id}>
            <GalleryItem
              galleryItemStyles={{ ...styles.item, position: 'relative' }}
              fileUrl={
                (post.attachments &&
                  post.attachments[0] &&
                  post.attachments[0].file?.url) as string
              } // We know that is defined due to isPostWithFile check above
              postId={post.id}
            ></GalleryItem>
            {isDefined(galleryItemFooter) && (
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
          </View>
        ))}
      </Row>
    );
  };

  const renderFooter = () => {
    if (!hasMoreData) {
      return null;
    }

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator
          size="small"
          color="#000000"
        />
      </View>
    );
  };

  return (
    <FlatList
      data={arrangedPosts}
      renderItem={listItem}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached ? () => onEndReached() : undefined}
      onEndReachedThreshold={0.5}
      initialNumToRender={9}
      windowSize={9}
    />
  );
};

export default ScrollableGalleryLayout;


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
