import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { SVGIcon } from 'components/icon';
import { PictureCheckMarkSVG } from 'components/icon/svg-components';
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

export const ManageFeaturedPosts: FC<ManageFeaturedPostsProps> = ({
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
    isLoading: userFeatuedPostsLoading,
    postsWithAttachmentsAndFiles: userFeaturedPosts,
  } = useGetFeaturedPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      ownerId: profileId,
      ownerType: postOwnerType,
      isFeaturedByUsers: true,
      isFeaturedByPerformers: false,
      limit: queryLimit,
    },
  });

  const hasNextPage = userFeaturedPosts
    ? userFeaturedPosts.length >= queryLimit
    : false;

  const UserFeaturedPostFooter = ({ featureCount }: Post) => {
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
        <SVGIcon
          width={18}
          height={18}
          styles={{ marginRight: SPACING_XXSMALL }}
        >
          <PictureCheckMarkSVG></PictureCheckMarkSVG>
        </SVGIcon>
        <AppText
          size="small"
          weight="bold"
        >
          {featureCount} features
        </AppText>
      </View>
    );
  };

  return (
    <>
      {userFeaturedPosts && userFeaturedPosts.length && (
        <ScrollableGalleryLayout
          posts={userFeaturedPosts}
          galleryItemFooter={UserFeaturedPostFooter}
          onEndReached={() => {
            if (hasNextPage) {
              setqueryLimit(queryLimit + 9);
            }
          }}
          hasMoreData={hasNextPage}
        ></ScrollableGalleryLayout>
      )}
      {userFeaturedPosts && !userFeaturedPosts.length && (
        <AppText>
          No users have featured your posts yet. Check back later!
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
