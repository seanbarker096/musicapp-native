import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import {
  CheckCircleSVG,
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
  useFeaturesDeleteMutation,
  useFeaturesGetQuery,
} from 'store/features/features.queries';
import {
  Feature,
  FeaturedEntityType,
  FeaturerType,
} from 'store/features/features.types';
import { Performer } from 'store/performers';
import { Post } from 'store/posts';
import { SPACING_SMALL, SPACING_XSMALL, SPACING_XXSMALL } from 'styles';

interface PostFooterProps {
  post: Post;
  postPerformer: Performer;
  handleLinkToPerformancePress?: () => void;
}

const PostFooter: FC<PostFooterProps> = ({
  post,
  postPerformer,
  handleLinkToPerformancePress,
}) => {
  const { profileState } = useContext(ProfileContext);
  const {
    profileId: viewingUserProfileId,
    profileType: viewingUserProfileType,
  } = profileState;

  const featurerType =
    viewingUserProfileType === ProfileType.PERFORMER
      ? FeaturerType.PERFORMER
      : FeaturerType.USER;

  const viewingUserIsPostOwner = viewingUserProfileId === post.ownerId;

  const canLinkToPerformance =
    (viewingUserProfileType === ProfileType.PERFORMER &&
      viewingUserProfileId === postPerformer.id) ||
    viewingUserIsPostOwner;

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

  const {
    data: artistFeatures,
    isLoading: artistFeatureGetLoading,
    isError: artistFeatureGetError,
  } = useFeaturesGetQuery({
    queryParams: {
      featuredEntityId: post.id,
      featuredEntityType: FeaturedEntityType.POST,
      featurerType: FeaturerType.PERFORMER,
      featurerId: postPerformer.id,
    },
  });

  const artistFeature = artistFeatures ? artistFeatures[0] : undefined;

  const loading =
    (!features && featuresGetLoading) ||
    (!artistFeatures && artistFeatureGetLoading);
  const error =
    (!features && featuresGetError) ||
    (!artistFeatures && artistFeatureGetError);

  const {
    mutateAsync: createFeature,
    isLoading: createFeatureLoading,
    isError: createFeatureError,
  } = useFeatureCreateMutation();

  const {
    mutateAsync: deleteFeature,
    isLoading: deleteFeatureLoading,
    isError: deleteFeatureError,
  } = useFeaturesDeleteMutation();

  async function featurePost() {
    await createFeature({
      featuredEntityId: post.id,
      featuredEntityType: FeaturedEntityType.POST,
      featurerId: viewingUserProfileId,
      featurerType: featurerType,
    });
  }

  async function unFeaturePost(feature: Feature) {
    await deleteFeature({
      ids: [feature.id],
    });
  }

  return (
    <>
      {!loading && !error && (
        <View style={{ ...styles.container }}>
          <View
            style={{
              ...styles.sidePadding,
              ...styles.flexRowContainer,
              marginBottom: SPACING_SMALL,
            }}
          >
            {!viewingUserIsPostOwner && (
              <PostFooterAction
                actionCompleted={!!feature}
                actionCompletedState={{
                  icon: PictureCheckMarkSVG,
                  text: 'Featured',
                  onIconPress: () =>
                    !!feature ? unFeaturePost(feature) : () => {},
                }}
                actionUncompletedState={{
                  icon: PicturePlusSVG,
                  text: 'Feature on your profile',
                  onIconPress: featurePost,
                }}
              ></PostFooterAction>
            )}
            {canLinkToPerformance && (
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
                <AppText>Link to a performance</AppText>
              </Pressable>
            )}
          </View>

          {artistFeature && (
            <View
              style={{
                ...styles.sidePadding,
                ...styles.flexRowContainer,
                marginBottom: SPACING_SMALL,
              }}
            >
              <SVGIcon
                color={IconColor.PRIMARY}
                styles={{ marginRight: SPACING_XXSMALL }}
              >
                <CheckCircleSVG></CheckCircleSVG>
              </SVGIcon>
              <AppText>Featured by {postPerformer.name}</AppText>
            </View>
          )}
        </View>
      )}
      {!feature && loading && <AppText>Loading...</AppText>}
      {!feature && error && <AppText>Error...</AppText>}
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
