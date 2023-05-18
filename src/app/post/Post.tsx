import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import { PlayButtonSVG } from 'components/icon/svg-components';

import { ProfileContext, ProfileType } from 'contexts/profile.context';
import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
  VideoReadyForDisplayEvent,
} from 'expo-av';
import React, { FC, useContext } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Shine,
} from 'rn-placeholder';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { Performance } from 'store/performances/performances.types';
import { Performer } from 'store/performers';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { PostOwnerType } from 'store/posts';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import { useUserGetQuery } from 'store/users';
import { SPACING_XSMALL, SPACING_XXSMALL } from 'styles';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import PerformerPostHeader from './PerformerPostHeader';
import PostFooter from './PostFooter';
import UserPostHeader from './UserPostHeader';
import { PostStackParamList } from './post.types';

type PostProps = NativeStackScreenProps<PostStackParamList, 'Post'>;

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
    params: { postId },
  },
  navigation,
}) => {
  const { profileState } = useContext(ProfileContext);
  const { profileId, profileType } = profileState;

  const postOwnerType =
    profileType === ProfileType.PERFORMER
      ? PostOwnerType.PERFORMER
      : PostOwnerType.USER;

  const { isLoading: postLoading, postsWithAttachmentsAndFiles: posts } =
    useGetPostsWithAttachmentsAndFilesQuery({
      queryParams: {
        id: postId,
        ownerType: postOwnerType,
        ownerId: profileId,
      },
      enabled: true,
    });

  const post = posts && posts[0];

  const {
    data: userData,
    isLoading: isPostOwnerLoading,
    isError: isPostOwnerGetError,
  } = useUserGetQuery({
    queryParams: { id: post?.ownerId },
    enabled: !!(post?.ownerType === PostOwnerType.USER),
  });

  // TODO: Move to a post header component
  const {
    data: performerData,
    isLoading: isPerformerLoading,
    isError: isPerformerGetError,
  } = usePerformersGetQuery({
    queryParams: { id: post?.ownerId },
    enabled: !!(post?.ownerType === PostOwnerType.PERFORMER),
  });

  const user = userData && userData[0];
  const performer = performerData && performerData[0];

  const ownerReady = performer || user;

  // Fetch any performances tagged in this post
  const {
    data: performanceTags,
    isLoading: performanceTagsLoading,
    error: performanceTagsError,
  } = useTagsGetQuery({
    queryParams: {
      taggedInEntityType: TaggedInEntityType.POST,
      taggedInEntityId: post?.id,
      taggedEntityType: TaggedEntityType.PERFORMANCE,
    },
    enabled: !!post?.id,
  });

  // If one exists, get performance, and use to get performer_id
  const taggedPerformanceId =
    performanceTags && performanceTags[0]?.taggedEntityId;

  const {
    data: taggedPerformances,
    isLoading: taggedPerformanceLoading,
    error: taggedPerformanceGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      id: taggedPerformanceId,
    },
    enabled: !!taggedPerformanceId,
  });

  const taggedPerformance = taggedPerformances && taggedPerformances[0];

  // otherwise, check if post has been tagged with a performer
  const {
    data: postPerformerTags,
    isLoading: postPerformerTagsLoading,
    error: postPerformerTagsError,
  } = useTagsGetQuery({
    queryParams: {
      taggedInEntityType: TaggedInEntityType.POST,
      taggedInEntityId: post?.id,
      taggedEntityType: TaggedEntityType.PERFORMER,
    },
    enabled: !taggedPerformanceId, // we only need to check user tags if there is no performance linked to the post
  });

  const performerTag = postPerformerTags && postPerformerTags[0];

  const taggedPerformerId = performerTag && performerTag.taggedEntityId;

  console.log(taggedPerformance, taggedPerformerId);
  const {
    data: performers,
    isLoading: taggedPerformerLoading,
    error: taggedPerformerGetError,
  } = usePerformersGetQuery({
    queryParams: {
      id: taggedPerformance?.performerId ?? taggedPerformerId,
    },
    enabled: !!taggedPerformance?.performerId || !!taggedPerformerId,
  });

  const postPerformer = performers && performers[0];

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

  function navigateToPerformerProfile(
    performer: Performer,
    performance?: Performance,
  ) {
    console.log(performer, performance);
    if (performance) {
      navigation.navigate('PerformanceStack', {
        performanceId: performance.id,
        performerId: performer.id,
      });
    } else {
      navigation.navigate('ProfileStack', {
        profileId: performer.id,
        profileType: ProfileType.PERFORMER,
      });
    }
  }

  const PostHeader = () =>
    ownerReady ? (
      <View
        style={{
          padding: SPACING_XSMALL,
          ...styles.header,
          ...styles.flexRowContainer,
        }}
      >
        {post?.ownerType === PostOwnerType.PERFORMER &&
          performer &&
          postPerformer && (
            <PerformerPostHeader
              profileImageUrl={performer.imageUrl}
              displayName={performer.name}
              performanceText={`${postPerformer.name}${
                taggedPerformance ? ' @ ' + taggedPerformance?.venueName : ''
              }`}
              onPerformerPress={() =>
                navigateToPerformerProfile(postPerformer, taggedPerformance)
              }
            ></PerformerPostHeader>
          )}
        {post?.ownerType === PostOwnerType.USER && user && postPerformer && (
          <UserPostHeader
            avatarImageUrl={user.avatarFile?.url}
            username={user.username}
            performanceText={`${postPerformer.name}${
              taggedPerformance ? ' @ ' + taggedPerformance?.venueName : ''
            }`}
            onPerformerPress={() =>
              navigateToPerformerProfile(postPerformer, taggedPerformance)
            }
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
    <>
      {post && postPerformer && (
        <View style={styles.container}>
          <PostHeader />
          <Pressable
            onPress={handlePlayPress}
            style={{
              ...styles.videoContainer,
              marginBottom: SPACING_XSMALL,
              backgroundColor: 'black',
            }}
          >
            <Video
              ref={video}
              style={{
                width: componentState.videoWidth,
                height: componentState.videoHeight,
                minWidth: DEVICE_WIDTH,
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
          <PostFooter
            post={post}
            postPerformer={postPerformer}
            handleLinkToPerformancePress={() =>
              navigation.navigate('PostLinkToPerformance', {
                postId: post.id,
                performerId: postPerformer.id,
              })
            }
          ></PostFooter>

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
      )}
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
