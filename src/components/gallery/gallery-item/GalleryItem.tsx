import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from 'expo-av';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Post } from 'store/posts/posts.types';

interface GalleryItemProps {
  post: Post;
}

const LOADING_STRING = '... loading ...';
const BUFFERING_STRING = '...buffering...';
const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const GalleryItem: FC<GalleryItemProps> = ({ post }) => {
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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default GalleryItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
