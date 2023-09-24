import { Row } from 'components/row';
import React, { FC, ReactElement, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { Post } from 'store/posts/posts.types';
import { SPACING_NONE, SPACING_XXSMALL, SPACING_XXXSMALL } from 'styles';
import { isPostWithFile } from 'utils/utils';
import { GalleryItem } from '../gallery-item/GalleryItem';
import { MemoizedGalleryItemFooter } from '../gallery-item/MemoizedGalleryItemFooter';
import { GALLERY_ITEM_HEIGHT } from '../gallery.types';

interface GalleryLayoutProps {
  posts: readonly Post[];
  /**
   * A function that returns a ReactElement to be rendered as the footer of each gallery item.
   */
  galleryItemFooter?: (post: Post) => ReactElement;
  onEndReached?: () => void;
  hasMoreData?: boolean;
  handleGalleryItemPress?: (postId: number) => void;
}

export const ScrollableGalleryLayout: FC<GalleryLayoutProps> = ({
  posts,
  galleryItemFooter,
  onEndReached = undefined,
  hasMoreData,
  handleGalleryItemPress,
}) => {
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

  const listItem = ({ item, index }: ListRenderItemInfo<Post[]>) => {
    return (
      <Row
        key={index}
        maxItems={3}
      >
        {item.filter(isPostWithFile).map((post, j) => (
          <>
            <GalleryItem
              galleryItemStyles={{
                ...styles.item,
                ...{
                  marginRight: j === 2 ? SPACING_NONE : SPACING_XXXSMALL / 2, // No margin for rightmost item
                },
                position: 'relative',
              }}
              thumbnailUrl={
                post.attachments &&
                post.attachments[0] &&
                post.attachments[0].thumbnailFile?.url
              }
              postId={post.id}
              handleGalleryItemPress={() =>
                handleGalleryItemPress
                  ? handleGalleryItemPress(post.id)
                  : undefined
              }
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
      <View
        style={{
          paddingVertical: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <ActivityIndicator
          size="small"
          color="#000000"
        />
      </View>
    );
  };

  return (
    <View style={{ height: 400, width: '100%' }}>
      <FlatList
        data={processedPosts}
        renderItem={listItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) {
            return;
          }
          !!onEndReached && onEndReached();
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: GALLERY_ITEM_HEIGHT,
          offset: GALLERY_ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={Math.ceil(400 / GALLERY_ITEM_HEIGHT)} // Render initial items based on window height
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: SPACING_XXXSMALL / 2,
    marginRight: SPACING_XXXSMALL / 2,
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
