import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { SVGIcon } from 'components/icon';
import { PictureCheckMarkSVG } from 'components/icon/svg-components';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Post, PostOwnerType } from 'store/posts';
import {
  COLOR_NEUTRAL_XXXXLIGHT,
  COLOR_PRIMARY_DARK,
  FONT_WEIGHT_BOLD,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';
import { useGetFeaturedPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import { ManageStackParamList } from './manage-types';

type ManageFeaturedPostsProps = NativeStackScreenProps<
  ManageStackParamList,
  'ManageFeaturedPosts'
>;

enum SelectedTab {
  USER_FEATURES = 'userFeatures',
  PERFORMER_FEATURES = 'performerFeatures',
}

export const ManageFeaturedPosts: FC<ManageFeaturedPostsProps> = ({
  navigation,
}) => {
  const { profileState } = useContext(ProfileContext);
  const { profileId, profileType } = profileState;

  const [selectedTab, setSelectedTab] = React.useState<SelectedTab>(
    SelectedTab.PERFORMER_FEATURES,
  );

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
    },
    enabled: selectedTab === SelectedTab.USER_FEATURES,
  });

  const {
    isLoading: artistFeaturedPostsLoading,
    postsWithAttachmentsAndFiles: artistFeaturedPosts,
  } = useGetFeaturedPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      ownerId: profileId,
      ownerType: postOwnerType,
      isFeaturedByUsers: false,
      isFeaturedByPerformers: true,
    },
    enabled: selectedTab === SelectedTab.PERFORMER_FEATURES,
  });

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
      <View style={styles.headerContainer}>
        <Pressable
          style={
            selectedTab === SelectedTab.USER_FEATURES
              ? styles.selectedTab
              : styles.tabItem
          }
          onPress={() => setSelectedTab(SelectedTab.USER_FEATURES)}
        >
          <AppText weight={FONT_WEIGHT_BOLD}>Featured by users</AppText>
        </Pressable>
        <Pressable
          style={
            selectedTab === SelectedTab.PERFORMER_FEATURES
              ? styles.selectedTab
              : styles.tabItem
          }
          onPress={() => setSelectedTab(SelectedTab.PERFORMER_FEATURES)}
        >
          <AppText weight={FONT_WEIGHT_BOLD}>Featured by artists</AppText>
        </Pressable>
      </View>
      {selectedTab === SelectedTab.USER_FEATURES && userFeaturedPosts && (
        <>
          {userFeaturedPosts.length && (
            <ScrollableGalleryLayout
              posts={userFeaturedPosts}
              galleryItemFooter={UserFeaturedPostFooter}
            ></ScrollableGalleryLayout>
          )}
          {!userFeaturedPosts.length && (
            <AppText>No users have featured your posts yet</AppText>
          )}
        </>
      )}
      {selectedTab === SelectedTab.PERFORMER_FEATURES &&
        artistFeaturedPosts && (
          <>
            {artistFeaturedPosts.length && (
              <ScrollableGalleryLayout
                posts={artistFeaturedPosts}
                galleryItemFooter={PerformerFeaturedPostFooter}
              ></ScrollableGalleryLayout>
            )}
            {!artistFeaturedPosts.length && (
              <AppText>No artists have featured your posts yet</AppText>
            )}
          </>
        )}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: SPACING_XXSMALL,
    paddingBottom: SPACING_XXSMALL,
    width: '100%',
  },
  flexRowContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  selectedTab: {
    borderWidth: 0,
    borderBottomWidth: 5,
    borderBottomColor: COLOR_PRIMARY_DARK,
    padding: SPACING_XXSMALL,
    paddingBottom: 0,
  },
  tabItem: {
    padding: SPACING_XXSMALL,
    paddingBottom: 0,
  },
});
