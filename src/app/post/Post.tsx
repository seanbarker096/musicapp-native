import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserProfileStackScreenProps } from 'app/user-profile/UserProfileStackScreen';
import AppText from 'components/app-text/AppText';
import { IconColor, SVGIcon } from 'components/icon';
import {
  LikeHeartSVG,
  PicturePlusSVG,
  PlayButtonSVG,
} from 'components/icon/svg-components';
import ProfileImage from 'components/profile-image/ProfileImage';

import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
  VideoReadyForDisplayEvent,
} from 'expo-av';
import React, { FC } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useUserGetQuery } from 'store/users';
import { SPACING_SMALL, SPACING_XSMALL, SPACING_XXSMALL } from 'styles';

interface PostProps
  extends NativeStackScreenProps<UserProfileStackScreenProps, 'Post'> {}

interface PostComponentState {
  showPlayIcon: boolean;
  videoWidth: number;
  videoHeight: number;
}

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - 14 * 2;

export const Post: FC<PostProps> = ({
  route: {
    params: { post },
  },
}) => {
  const {
    user,
    isLoading: isPostOwnerLoading,
    isError: isPostOwnerGetError,
  } = useUserGetQuery({ id: post.ownerId });

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
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,
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

  const _onReadyForDisplay = (event: VideoReadyForDisplayEvent) => {
    const widestHeight =
      (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      setComponentState({
        ...componentState,
        videoWidth:
          (VIDEO_CONTAINER_HEIGHT * event.naturalSize.width) /
          event.naturalSize.height,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
      });
    } else {
      setComponentState({
        ...componentState,
        videoWidth: DEVICE_WIDTH,
        videoHeight:
          (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width,
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            padding: SPACING_XSMALL,
            ...styles.header,
            ...styles.flexRowContainer,
          }}
        >
          <ProfileImage
            size="medium"
            styles={{ marginRight: SPACING_XXSMALL }}
          ></ProfileImage>
          <AppText>dan13</AppText>
        </View>
        <Pressable
          onPress={handlePlayPress}
          style={{ ...styles.videoContainer, marginBottom: SPACING_XSMALL }}
        >
          <Video
            ref={video}
            style={{
              width: componentState.videoWidth,
              height: componentState.videoHeight,
              maxWidth: DEVICE_WIDTH,
            }}
            source={{
              uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            }}
            useNativeControls={true}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
            onReadyForDisplay={_onReadyForDisplay}
          />
          {componentState.showPlayIcon && (
            <SVGIcon
              styles={styles.playIcon}
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
        <View
          style={{
            ...styles.sidePadding,
            ...styles.flexRowContainer,
            marginBottom: SPACING_SMALL,
          }}
        >
          <View
            style={{ ...styles.flexRowContainer, marginRight: SPACING_XSMALL }}
          >
            <SVGIcon styles={{ marginRight: SPACING_XXSMALL }}>
              <LikeHeartSVG></LikeHeartSVG>
            </SVGIcon>
            <AppText>Like</AppText>
          </View>
          <View
            style={{ ...styles.flexRowContainer, marginRight: SPACING_XSMALL }}
          >
            <SVGIcon styles={{ marginRight: SPACING_XXSMALL }}>
              <PicturePlusSVG></PicturePlusSVG>
            </SVGIcon>
            <AppText>Feature on your profile</AppText>
          </View>
        </View>
        <View
          style={{
            ...styles.sidePadding,
            ...styles.flexRowContainer,
          }}
        >
          <AppText
            weight="bold"
            marginRight={SPACING_XXSMALL}
          >
            dan13
          </AppText>
          <AppText>{post.content}</AppText>
        </View>
      </View>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 60, height: 60, borderRadius: 50 }} />
          <View style={{ marginLeft: 20 }}>
            <Image
              style={{ width: 120, height: 20 }}
              source={require('./../../assets/avatar.png')}
            />
            <Text style={{ marginTop: 6, fontSize: 14, lineHeight: 18 }}>
              Hello world
            </Text>
          </View>
        </View>
      </SkeletonPlaceholder>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  flexRowContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
  },
  sidePadding: { paddingLeft: SPACING_XSMALL, paddingRight: SPACING_XSMALL },
  videoContainer: {
    position: 'relative',
    height: 'auto',
  },
  playIcon: {
    left: '50%',
    top: '55%',
    transform: [{ translateY: -25 }, { translateY: -25 }],
  },
});
