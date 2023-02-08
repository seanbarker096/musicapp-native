import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserProfileStackScreenProps } from 'app/user-profile/UserProfileStackScreen';
import { IconColor, SVGIcon } from 'components/icon';
import { PlayButtonSVG } from 'components/icon/svg-components';
import ProfileImage from 'components/profile-image/ProfileImage';

import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from 'expo-av';
import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PostProps
  extends NativeStackScreenProps<UserProfileStackScreenProps, 'Post'> {}

interface PostComponentState {
  showPlayIcon: boolean;
}

export const Post: FC<PostProps> = ({ route }) => {
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

  const [componentState, setComponentState] =
    React.useState<PostComponentState>({
      showPlayIcon: true,
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

  function handlePlayPress() {
    console.log('running');
    if (video.current == null) {
      return;
    }

    setComponentState({ ...componentState, showPlayIcon: false });

    if (videoStatus.isPlaying) {
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
  }

  return (
    <View>
      <View>
        <ProfileImage></ProfileImage>
        <Text>dan13</Text>
      </View>
      <Pressable
        onPress={handlePlayPress}
        style={styles.videoContainer}
      >
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
        />
        {componentState.showPlayIcon && (
          <SVGIcon
            inheritedStyles={styles.playIcon}
            color={IconColor.MID}
            height={50}
            position="absolute"
            width={50}
            handlePress={handlePlayPress}
          >
            <PlayButtonSVG opacity={0.6}></PlayButtonSVG>
          </SVGIcon>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  video: {
    top: 0,
    left: 0,
    width: '100%',
    height: 500,
  },
  videoContainer: {
    position: 'relative',
    height: 500,
    width: '100%',
  },
  playIcon: {
    left: '50%',
    top: '55%',
    transform: [{ translateY: -25 }, { translateY: -25 }],
  },
});
