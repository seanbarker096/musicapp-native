import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import {
  LinkSVG,
  StarFilledSVG,
  StarOutlineSVG,
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

  const viewingUserIsPostOwner = viewingUserProfileId === post.ownerId;

  const canLinkToPerformance =
    (viewingUserProfileType === ProfileType.PERFORMER &&
      viewingUserProfileId === postPerformer.id) ||
    viewingUserIsPostOwner;

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

  const loading = !artistFeatures && artistFeatureGetLoading;
  const error = !artistFeatures && artistFeatureGetError;

  const {
    mutateAsync: createFeature,
    isLoading: createFeatureLoading,
    isError: createFeatureError,
  } = useFeatureCreateMutation({
    featurerId: postPerformer.id,
    featurerType: FeaturerType.PERFORMER,
    postIds: [post.id],
  });

  const {
    mutateAsync: deleteFeature,
    isLoading: deleteFeatureLoading,
    isError: deleteFeatureError,
  } = useFeaturesDeleteMutation({
    featurerId: postPerformer.id,
    featurerType: FeaturerType.PERFORMER,
    postIds: [post.id],
  });

  async function featurePost() {
    await createFeature({
      featuredEntityId: post.id,
      featuredEntityType: FeaturedEntityType.POST,
      featurerId: viewingUserProfileId,
      featurerType: FeaturerType.PERFORMER,
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
        <View
          style={{
            ...styles.sidePadding,
            ...styles.flexRowContainer,
            marginBottom: SPACING_SMALL,
          }}
        >
          {/* If viewing user is the performer in the post, then give them the option to artist pick*/}
          {viewingUserProfileId === postPerformer.id &&
            viewingUserProfileType === ProfileType.PERFORMER && (
              <PostFooterAction
                actionCompleted={!!artistFeature}
                actionCompletedState={{
                  icon: StarFilledSVG,
                  text: 'Artist pick',
                  iconColor: IconColor.PRIMARY,
                  onIconPress: () =>
                    !!artistFeature ? unFeaturePost(artistFeature) : () => {},
                }}
                actionUncompletedState={{
                  icon: StarOutlineSVG,
                  text: 'Artist pick',
                  onIconPress: featurePost,
                }}
              ></PostFooterAction>
            )}
          {artistFeature &&
            (viewingUserProfileId !== postPerformer.id ||
              viewingUserProfileType !== ProfileType.PERFORMER) && (
              <View
                style={{
                  ...styles.sidePadding,
                  ...styles.flexRowContainer,
                }}
              >
                <SVGIcon
                  color={IconColor.PRIMARY}
                  styles={{ marginRight: SPACING_XXSMALL }}
                >
                  <StarFilledSVG></StarFilledSVG>
                </SVGIcon>
                <AppText>Picked by {postPerformer.name}</AppText>
              </View>
            )}
          {canLinkToPerformance && (
            <Pressable
              onPress={handleLinkToPerformancePress}
              style={{
                ...styles.flexRowContainer,
                marginRight: SPACING_XSMALL,
              }}
            >
              <SVGIcon
                handlePress={handleLinkToPerformancePress}
                styles={{ marginRight: SPACING_XXSMALL }}
                width={20}
                height={20}
              >
                <LinkSVG></LinkSVG>
              </SVGIcon>
              <AppText>Link to a performance</AppText>
            </Pressable>
          )}
        </View>
      )}
      {!artistFeature && loading && <AppText>Loading...</AppText>}
      {!artistFeature && error && <AppText>Error...</AppText>}
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
