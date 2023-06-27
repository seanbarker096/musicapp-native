import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';

import { AppPlayButton } from 'components/app-play-button';
import { ProfileType } from 'contexts/profile.context';
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
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { Performance } from 'store/performances/performances.types';
import { Performer } from 'store/performers';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import { useUserGetQuery } from 'store/users';
import { User } from 'store/users/users.types';
import { SPACING_XSMALL, SPACING_XXSMALL } from 'styles';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
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
  const { isLoading: postLoading, postsWithAttachmentsAndFiles: posts } =
    useGetPostsWithAttachmentsAndFilesQuery({
      queryParams: {
        id: postId,
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
  });

  const postOwner = userData && userData[0];

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

  function navigateToPostCreatorProfile(user: User) {
    navigation.navigate('ProfileStack', {
      profileId: user.id,
      profileType: ProfileType.USER,
    });
  }

  const Header = () =>
    postOwner ? (
      <PostHeader
        imgUrl={postOwner.avatarFile?.url}
        name={postOwner.username}
        performanceText={
          postPerformer
            ? `${postPerformer.name}${
                taggedPerformance ? ' @ ' + taggedPerformance?.venueName : ''
              }`
            : ''
        }
        onPerformerPress={() =>
          postPerformer
            ? navigateToPerformerProfile(postPerformer, taggedPerformance)
            : undefined
        }
        onPostCreatorPress={() => navigateToPostCreatorProfile(postOwner)}
      ></PostHeader>
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
      {post && (
        <View style={styles.container}>
          <Header />
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
              <AppPlayButton handlePlayPress={handlePlayPress}></AppPlayButton>
            )}
          </Pressable>
          {postPerformer && (
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
          )}
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
              {postOwner && isPerformer(postOwner)
                ? postOwner.name
                : postOwner?.username}
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

function isPerformer(person?: User | Performer): person is Performer {
  return !!person && 'uuid' in person;
}