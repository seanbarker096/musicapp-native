import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppEmptyState } from 'components/app-empty-state';
import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Post, PostOwnerType } from 'store/posts';
import {
  APP_GUTTER,
  COLOR_NEUTRAL_XXXXLIGHT,
  COLOR_PRIMARY,
  SPACING_LARGE,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';
import { useGetFeaturedPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import { ManageStackParamList } from './manage-types';

type ManageFeaturedPostsProps = NativeStackScreenProps<
  ManageStackParamList,
  'ManageFeaturedPosts'
>;

export const ManageArtistPicks: FC<ManageFeaturedPostsProps> = ({
  navigation,
}) => {
  const { profileState } = useContext(ProfileContext);
  const { profileId, profileType } = profileState;
  const [queryLimit, setqueryLimit] = useState(9);

  const {
    isLoading: artistFeaturedPostsLoading,
    postsWithAttachmentsAndFiles: artistFeaturedPosts,
  } = useGetFeaturedPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      ownerId: profileId,
      ownerType: PostOwnerType.USER,
      isFeaturedByUsers: false,
      isFeaturedByPerformers: true,
      limit: queryLimit,
    },
  });

  const isFeaturedByPerformersHasNextPage = artistFeaturedPosts
    ? artistFeaturedPosts.length >= queryLimit
    : false;

  const PerformerFeaturedPostFooter = ({ featuringPerformer }: Post) => {
    return (
      <>
        {featuringPerformer && (
          <View
            style={{
              ...styles.flexRowContainer,
              backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
              opacity: 0.85,
              paddingLeft: SPACING_XXSMALL,
              paddingRight: SPACING_XXSMALL,
              paddingTop: SPACING_XXXSMALL,
              paddingBottom: SPACING_XXXSMALL,
            }}
          >
            <ProfileImage
              imageUrl={featuringPerformer.imageUrl}
              styles={{ marginRight: SPACING_XXSMALL }}
              size="xsmall"
            ></ProfileImage>
            <AppText
              size="small"
              weight="bold"
            >
              {featuringPerformer.name}
            </AppText>
          </View>
        )}
      </>
    );
  };

  return (
    <>
      {artistFeaturedPosts && !!artistFeaturedPosts.length && (
        <>
          <View
            style={{
              padding: APP_GUTTER,
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: SPACING_LARGE,
            }}
          >
            <AppText
              size="large"
              weight="bold"
              marginBottom={SPACING_XXSMALL}
            >
              You're getting noticed!
            </AppText>
            <AppText textAlign="center">
              Some of your favourite artsits have picked your posts to appear on
              their profiles! You can find them all below.
            </AppText>
          </View>
          <View
            style={{
              ...styles.headerContainer,
            }}
          ></View>

          <ScrollableGalleryLayout
            posts={artistFeaturedPosts}
            galleryItemFooter={PerformerFeaturedPostFooter}
            onEndReached={() => {
              if (isFeaturedByPerformersHasNextPage) {
                setqueryLimit(queryLimit + 9);
              }
            }}
            hasMoreData={isFeaturedByPerformersHasNextPage}
            handleGalleryItemPress={postId =>
              navigation.navigate('ViewPost', { postId })
            }
          ></ScrollableGalleryLayout>
        </>
      )}
      {artistFeaturedPosts && !artistFeaturedPosts.length && (
        <AppEmptyState
          primaryMessage="Your posts, hand picked by your favourite artists"
          secondaryMessage="No artists have picked your posts yet to appear in their Gallery yet. Link your posts to the artists performance so they can see them, and pick them to appear on their profile."
        ></AppEmptyState>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flexRowContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  headerContainer: {
    backgroundColor: COLOR_PRIMARY,
    paddingVertical: SPACING_XXSMALL,
    paddingHorizontal: APP_GUTTER,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
});
