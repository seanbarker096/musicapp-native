import { NavigationProp, useNavigation } from '@react-navigation/native';
import { UserProfileStackScreenProps } from 'app/user-profile/UserProfileStackScreen';
import { IconColor, SVGIcon } from 'components/icon/index';
import { PlayButtonSVG } from 'components/icon/svg-components';
import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from 'expo-av';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Post } from 'store/posts/posts.types';

interface GalleryItemProps {
  post: Post;
  galleryItemStyles: { [style: string]: any };
}

const LOADING_STRING = '... loading ...';
const BUFFERING_STRING = '...buffering...';
const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const GalleryItem: FC<GalleryItemProps> = ({ post, galleryItemStyles }) => {
  const navigation =
    useNavigation<NavigationProp<UserProfileStackScreenProps>>();

  const video = React.useRef<Video>(null);
  const [videoStatus, setStatus] = React.useState<
    Partial<AVPlaybackStatusSuccess>
  >({
    isMuted: false,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    isLoaded: true,
    shouldCorrectPitch: true,
    volume: 1.0,
    rate: 1.0,
  });

  function _onPlaybackStatusUpdate(status: AVPlaybackStatus): void {
    if (status.isLoaded) {
      setStatus({
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        isMuted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
      if (status.didJustFinish && !status.isLooping) {
        // this._advanceIndex(true);
        // this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  }

  function handleItemPress() {
    navigation.navigate('Post', { post: post });
  }

  return (
    <View style={{ ...galleryItemStyles }}>
      <Pressable
        style={styles.videoOverlay}
        onPress={handleItemPress}
      >
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping
          onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
        />
        <SVGIcon
          styles={styles.playIcon}
          color={IconColor.LIGHT}
          position={'absolute'}
        >
          <PlayButtonSVG></PlayButtonSVG>
        </SVGIcon>
      </Pressable>
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
