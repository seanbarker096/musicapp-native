import { GalleryItem, MemoizedGalleryItemFooter } from 'components/gallery';

import { Row } from 'components/row';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { Post } from 'store/posts/posts.types';
import { SPACING_XXSMALL } from 'styles';
import { isPostWithFile } from 'utils/utils';
import { GALLERY_ITEM_HEIGHT } from '../gallery.types';

interface GalleryLayoutProps {
  posts: readonly Post[];
  /**
   * A function that returns a ReactElement to be rendered as the footer of each gallery item.
   */
  galleryItemFooter?: (post: Post) => ReactElement;
  onEndReached?: () => void;
  hasMoreData?: boolean;
}

export const ScrollableGalleryLayout: FC<GalleryLayoutProps> = ({
  posts,
  galleryItemFooter,
  onEndReached,
  hasMoreData,
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  const processedPosts: Post[][] = useMemo(() => {
    const arrangedPosts: Post[][] = [];
    // map over posts and put them into a lis of nested arrays, with with post per array
    posts.forEach((post, index) => {
      const i = Math.floor(index / 3);

      if (!arrangedPosts[i]) {
        arrangedPosts[i] = [];
      }

      arrangedPosts[i].push(post);
    });

    return arrangedPosts;
  }, [posts]);

  console.log(
    'arrangedPosts',
    posts.map(post => post.id),
  );

  const listItem = ({ item, index }: ListRenderItemInfo<Post[]>) => {
    return (
      <Row
        key={index}
        maxItems={3}
      >
        {item.filter(isPostWithFile).map(post => (
          <>
            <GalleryItem
              galleryItemStyles={{ ...styles.item, position: 'relative' }}
              fileUrl={
                (post.attachments &&
                  post.attachments[0] &&
                  post.attachments[0].file?.url) as string
              } // We know that is defined due to isPostWithFile check above
              postId={post.id}
            ></GalleryItem>
            {galleryItemFooter && (
              <MemoizedGalleryItemFooter
                post={post}
                galleryItemFooter={galleryItemFooter}
              />
            )}
          </>
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

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
  };

  return (
    <View style={{ flexGrow: 1, height: 150, width: '100%' }}>
      <FlatList
        data={processedPosts}
        renderItem={listItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) return;
          console.log('onEndReached', distanceFromEnd);
          onEndReached();
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: GALLERY_ITEM_HEIGHT,
          offset: GALLERY_ITEM_HEIGHT * index,
          index,
        })}
        onScroll={handleScroll} // Track the scroll offset
        initialNumToRender={Math.ceil(150 / GALLERY_ITEM_HEIGHT)} // Render initial items based on window height
        initialScrollIndex={Math.floor(scrollOffset / GALLERY_ITEM_HEIGHT)} // Set initial scroll index based on scroll offset
      />
    </View>
  );
};

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
