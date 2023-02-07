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
import { StyleSheet, Text, View } from 'react-native';

interface PostProps
  extends NativeStackScreenProps<UserProfileStackScreenProps, 'Post'> {}

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
    <View>
      <View>
        <ProfileImage></ProfileImage>
        <Text>dan13</Text>
      </View>
      <View style={styles.videoContainer}>
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
      <SVGIcon
        inheritedStyles={styles.playIcon}
        color={IconColor.LIGHT}
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        position={'absolute'}
      >
        <PlayButtonSVG></PlayButtonSVG>
      </SVGIcon>
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
    top: '50%',
    transform: [{ translateY: -11 }, { translateX: -11 }],
  },
});
