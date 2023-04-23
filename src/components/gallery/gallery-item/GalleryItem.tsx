import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';

import { IconColor, SVGIcon } from 'components/icon/index';
import { PlayButtonSVG } from 'components/icon/svg-components';
import { ResizeMode, Video } from 'expo-av';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Post } from 'store/posts/posts.types';

interface GalleryItemProps {
  post: Post;
  galleryItemStyles: { [style: string]: any };
  hidePlayButton?: boolean;
}

const LOADING_STRING = '... loading ...';
const BUFFERING_STRING = '...buffering...';
const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const GalleryItem: FC<GalleryItemProps> = ({
  post,
  galleryItemStyles,
  hidePlayButton = false,
}) => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const video = React.useRef<Video>(null);
  function handleItemPress() {
    navigation.navigate('ViewPost', { postId: post.id });
  }

  // TODO add state for if no file was retried (e.g. just empty tstate message as we can't load post in this case)
  return (
    <View style={{ ...galleryItemStyles, height: 100 }}>
      {post.attachments && post.attachments[0]?.file && (
        <Pressable
          style={styles.videoOverlay}
          onPress={handleItemPress}
        >
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: post.attachments[0].file.url,
            }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
          />
          {hidePlayButton && (
            <SVGIcon
              styles={styles.playIcon}
              color={IconColor.LIGHT}
              position={'absolute'}
            >
              <PlayButtonSVG></PlayButtonSVG>
            </SVGIcon>
          )}
        </Pressable>
      )}
    </View>
  );
};

export default GalleryItem;

const styles = StyleSheet.create({
  container: {},
  video: {
    top: 0,
    left: 0,
    width: '100%',
    height: 100,
  },
  videoOverlay: {
    position: 'relative',
    height: 100,
    width: '100%',
  },
  playIcon: {
    left: '85%',
    top: '85%',
    transform: [{ translateY: -11 }, { translateX: -11 }],
  },
});
