import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import { PlayButtonSVG } from 'components/icon/svg-components';

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
import { useArtistsGetQuery } from 'store/artists/artists.queries';
import { PostOwnerType } from 'store/posts';
import { useUserGetQuery } from 'store/users';
import { SPACING_XSMALL, SPACING_XXSMALL } from 'styles';
import ArtistPostHeader from './ArtistPostHeader';
import PostFooter from './PostFooter';
import UserPostHeader from './UserPostHeader';

type PostProps = NativeStackScreenProps<ProfileStackParamList, 'ViewPost'>;

interface PostComponentState {
  showPlayIcon: boolean;
  videoWidth: number;
  videoHeight: number;
  useNativeControls: boolean;
}

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - 14 * 2;

//TODO: Could make a page wrapper component which takes in the route, gets post out,
// and then passes post into Post component which takes a single post prop. Means
// Post component is more resuable
export const Post: FC<PostProps> = ({
  route: {
    params: { post },
  },
}) => {
  const {
    data: userData,
    isLoading: isPostOwnerLoading,
    isError: isPostOwnerGetError,
  } = useUserGetQuery({
    queryParams: { id: post.ownerId },
    enabled: post.ownerType === PostOwnerType.USER,
  });

  const {
    data: artistData,
    isLoading: isArtistLoading,
    isError: isArtistGetError,
  } = useArtistsGetQuery({
    queryParams: { id: post.ownerId },
    enabled: post.ownerType === PostOwnerType.ARTIST,
  });

  const user = userData && userData[0];
  const artist = artistData && artistData[0];

  const ownerReady = artist || user;

  // TODO: Move all video to its own component
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

  const PostHeader = () =>
    ownerReady ? (
      <View
        style={{
          padding: SPACING_XSMALL,
          ...styles.header,
          ...styles.flexRowContainer,
        }}
      >
        {post.ownerType === PostOwnerType.ARTIST && artist && (
          <ArtistPostHeader
            profileImageUrl={artist.imageUrl}
            displayName={artist.name}
          ></ArtistPostHeader>
        )}
        {post.ownerType === PostOwnerType.USER && user && (
          <UserPostHeader
            avatarFileUuid={user.avatarFileUuid}
            username={user.username}
          ></UserPostHeader>
        )}
      </View>
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
      <PostHeader />
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
      <PostFooter post={post}></PostFooter>
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
