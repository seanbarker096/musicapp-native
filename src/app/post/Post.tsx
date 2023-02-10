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
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Shine,
} from 'rn-placeholder';
import { useFilesGetQuery } from 'store/files/files.queries';
import { useUserGetQuery } from 'store/users';
import { SPACING_SMALL, SPACING_XSMALL, SPACING_XXSMALL } from 'styles';

interface PostProps
  extends NativeStackScreenProps<UserProfileStackScreenProps, 'Post'> {}

interface PostComponentState {
  showPlayIcon: boolean;
  videoWidth: number;
  videoHeight: number;
  useNativeControls: boolean;
}

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - 14 * 2;

export const Post: FC<PostProps> = ({
  route: {
    params: { post },
  },
}) => {
  const {
    data: user,
    isLoading: isPostOwnerLoading,
    isError: isPostOwnerGetError,
  } = useUserGetQuery({ id: post.ownerId });

  const postOwner = user && user[0];

  const {
    isLoading: filesGetLoading,
    isError: isFilesGetError,
    data: files,
    error: filesGetError,
  } = useFilesGetQuery({
    queryParams: { uuid: postOwner ? postOwner.avatarFileUuid : undefined },
    enabled: !isPostOwnerLoading,
  });

  const avatarFile = files && files[0];

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
      useNativeControls: false,
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

    if (componentState.useNativeControls) {
      return;
    }

    setComponentState({
      ...componentState,
      showPlayIcon: false,
      useNativeControls: true,
    });

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

  const UserHeader =
    postOwner && avatarFile ? (
      <>
        <ProfileImage
          size="small"
          styles={{ marginRight: SPACING_XXSMALL }}
          imageUrl={avatarFile.url}
        ></ProfileImage>
        <AppText size="large">{postOwner.username}</AppText>
      </>
    ) : (
      <Placeholder
        Animation={props => (
          <Shine
            {...props}
            reverse={false}
          ></Shine>
        )}
      >
        <View style={{ ...styles.flexRowContainer }}>
          <PlaceholderMedia
            isRound={true}
            size={48}
            style={{ marginRight: SPACING_XXSMALL }}
          ></PlaceholderMedia>
          <PlaceholderLine
            height={20}
            width={50}
            noMargin={true}
          />
        </View>
      </Placeholder>
    );

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: SPACING_XSMALL,
          ...styles.header,
          ...styles.flexRowContainer,
        }}
      >
        {UserHeader}
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
            uri:
              post.attachments && post.attachments[0]?.file?.url
                ? post.attachments[0].file.url
                : '',
          }}
          useNativeControls={componentState.useNativeControls}
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
