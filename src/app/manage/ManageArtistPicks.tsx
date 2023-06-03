import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Post, PostOwnerType } from 'store/posts';
import {
  COLOR_NEUTRAL_XXXXLIGHT,
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

  const postOwnerType =
    profileType === ProfileType.PERFORMER
      ? PostOwnerType.PERFORMER
      : PostOwnerType.USER;

  const {
    isLoading: artistFeaturedPostsLoading,
    postsWithAttachmentsAndFiles: artistFeaturedPosts,
  } = useGetFeaturedPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      ownerId: profileId,
      ownerType: postOwnerType,
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
    );
  };

  return (
    <>
      {artistFeaturedPosts && !!artistFeaturedPosts.length && (
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
      )}
      {artistFeaturedPosts && !artistFeaturedPosts.length && (
        <AppText>
          No artists have picked your posts yet to appear in their Gallery yet.
          Link your posts to the artists performance to increase your chance of
          being featured.
        </AppText>
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
});
