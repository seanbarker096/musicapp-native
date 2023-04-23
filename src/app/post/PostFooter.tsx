import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import {
  FilledLikeHeartSVG,
  LikeHeartSVG,
  LinkSVG,
  PictureCheckMarkSVG,
  PicturePlusSVG,
} from 'components/icon/svg-components';
import { PostFooterAction } from 'components/post-footer-action';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  useFeatureCreateMutation,
  useFeaturesGetQuery,
} from 'store/features/features.queries';
import {
  FeaturedEntityType,
  FeaturerType,
} from 'store/features/features.types';
import { Post } from 'store/posts';
import { SPACING_SMALL, SPACING_XSMALL, SPACING_XXSMALL } from 'styles';

interface PostFooterProps {
  post: Post;
  postPerformerId?: number;
  handleLinkToPerformancePress?: () => void;
}

const PostFooter: FC<PostFooterProps> = ({
  post,
  postPerformerId,
  handleLinkToPerformancePress,
}) => {
  const { profileState } = useContext(ProfileContext);
  const {
    profileId: viewingUserProfileId,
    profileType: viewingUserProfileType,
  } = profileState;
  // TODO: Update ot use api call
  const [postLiked, setPostLiked] = React.useState(false);

  const featurerType =
    viewingUserProfileType === ProfileType.PERFORMER
      ? FeaturerType.PERFORMER
      : FeaturerType.USER;

  const {
    data: features,
    isLoading: featuresGetLoading,
    isError: featuresGetError,
  } = useFeaturesGetQuery({
    queryParams: {
      featuredEntityId: post.id,
      featuredEntityType: FeaturedEntityType.POST,
      featurerType: featurerType,
      featurerId: viewingUserProfileId,
    },
  });

  const feature = features ? features[0] : undefined;

  const userHasFeaturedPost = !!feature;

  const loading = featuresGetLoading;
  const error = !feature && featuresGetError;

  const {
    mutateAsync: createFeature,
    isLoading: createFeatureLoading,
    isError: createFeatureError,
  } = useFeatureCreateMutation();

  async function featurePost() {
    console.log('pressed');
    await createFeature({
      featuredEntityId: post.id,
      featuredEntityType: FeaturedEntityType.POST,
      featurerId: viewingUserProfileId,
      featurerType: featurerType,
    });
  }

  async function likePostClicked() {
    setPostLiked(!postLiked);
  }

  async function unFeaturePost() {
    console.log('unfeature');
  }

  return (
    <>
      <View>
        {!loading && !error && (
          <View
            style={{
              ...styles.sidePadding,
              ...styles.flexRowContainer,
              marginBottom: SPACING_SMALL,
            }}
          >
            <PostFooterAction
              actionCompleted={postLiked}
              actionCompletedState={{
                icon: FilledLikeHeartSVG,
                iconColor: IconColor.PRIMARY,
                text: undefined,
                onIconPress: likePostClicked,
              }}
              actionUncompletedState={{
                icon: LikeHeartSVG,
                text: undefined,
                onIconPress: likePostClicked,
              }}
            ></PostFooterAction>

            <PostFooterAction
              actionCompleted={!!userHasFeaturedPost}
              actionCompletedState={{
                icon: PictureCheckMarkSVG,
                text: 'Featured',
                onIconPress: unFeaturePost,
              }}
              actionUncompletedState={{
                icon: PicturePlusSVG,
                text: 'Feature on your profile',
                onIconPress: featurePost,
              }}
            ></PostFooterAction>

            {viewingUserProfileType === ProfileType.PERFORMER &&
              viewingUserProfileId === postPerformerId && (
                <Pressable
                  onPress={handleLinkToPerformancePress}
                  style={{
                    ...styles.flexRowContainer,
                    marginRight: SPACING_XSMALL,
                  }}
                >
                  <SVGIcon styles={{ marginRight: SPACING_XXSMALL }}>
                    <LinkSVG></LinkSVG>
                  </SVGIcon>
                  <AppText>Link to your performances</AppText>
                </Pressable>
              )}
          </View>
        )}
        {!feature && loading && <AppText>Loading...</AppText>}
        {!feature && error && <AppText>Error...</AppText>}
      </View>
    </>
  );
};

export default PostFooter;

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
