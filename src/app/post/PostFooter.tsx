import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import {
  LikeHeartSVG,
  PictureCheckMarkSVG,
  PicturePlusSVG,
} from 'components/icon/svg-components';
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
}

const PostFooter: FC<PostFooterProps> = ({ post }) => {
  const { profileState } = useContext(ProfileContext);

  // TODO: Update this to ideally have the post by featured by the performance the post is tagged in, not the performer
  const featurerType =
    profileState.profileType === ProfileType.PERFORMER
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
      featurerId: profileState.profileId,
    },
  });

  const feature = features ? features[0] : undefined;

  console.log(feature);
  console.log(post);

  const userHasFeaturedPost = !!feature;

  const loading = featuresGetLoading;
  const error = !feature && featuresGetError;

  const {
    mutateAsync: createFeature,
    isLoading: createFeatureLoading,
    isError: createFeatureError,
  } = useFeatureCreateMutation();

  async function handleFeaturePress() {
    console.log('pressed');
    await createFeature({
      featuredEntityId: post.id,
      featuredEntityType: FeaturedEntityType.POST,
      featurerId: profileState.profileId,
      featurerType: featurerType,
    });
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
            <View
              style={{
                ...styles.flexRowContainer,
                marginRight: SPACING_XSMALL,
              }}
            >
              <SVGIcon styles={{ marginRight: SPACING_XXSMALL }}>
                <LikeHeartSVG></LikeHeartSVG>
              </SVGIcon>
              <AppText>Like</AppText>
            </View>
            {userHasFeaturedPost && (
              <View
                style={{
                  ...styles.flexRowContainer,
                  marginRight: SPACING_XSMALL,
                }}
              >
                <SVGIcon styles={{ marginRight: SPACING_XXSMALL }}>
                  <PictureCheckMarkSVG></PictureCheckMarkSVG>
                </SVGIcon>
                <AppText>Featured</AppText>
              </View>
            )}
            {!userHasFeaturedPost && (
              <Pressable
                onPress={handleFeaturePress}
                style={{
                  ...styles.flexRowContainer,
                  marginRight: SPACING_XSMALL,
                }}
              >
                <SVGIcon styles={{ marginRight: SPACING_XXSMALL }}>
                  <PicturePlusSVG></PicturePlusSVG>
                </SVGIcon>
                <AppText>Feature on your profile</AppText>
              </Pressable>
            )}
          </View>
        )}
        {!feature && loading && <AppText>Loading...</AppText>}
        {!feature && error && <AppText>Error...</AppText>}
      </View>
      <View>
        <AppText>Test</AppText>
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
