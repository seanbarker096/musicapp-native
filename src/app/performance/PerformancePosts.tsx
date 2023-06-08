import { AppEmptyState } from 'components/app-empty-state';
import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { SVGIcon } from 'components/icon';
import { CalendarSVG } from 'components/icon/svg-components';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import {
  APP_GUTTER,
  COLOR_PRIMARY,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

type PerformancePostsProps = {
  performanceId: number;
  performerId: number;
  handleCreatePostPress: () => void;
  handlePostPress: (postId: number) => void;
};

export const PerformancePosts: FC<PerformancePostsProps> = ({
  performanceId,
  performerId,
  handleCreatePostPress,
  handlePostPress,
}) => {
  const { profileState } = useContext(ProfileContext);
  const {
    profileType: loggedInUserProfileType,
    profileId: loggedInUserProfileId,
  } = profileState;

  const loggedInUserIsPerformer =
    performerId === loggedInUserProfileId &&
    loggedInUserProfileType === ProfileType.PERFORMER;

  const {
    data: performerList,
    isLoading: performerLoading,
    error: performerGetError,
  } = usePerformersGetQuery({
    queryParams: {
      id: performerId,
    },
  });

  const performer = performerList?.[0];

  const {
    data: performanceList,
    isLoading: performanceLoading,
    error: performanceGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      id: performanceId,
    },
  });

  const performance = performanceList?.[0];

  const performanceDate = performance
    ? new Date(performance.performanceDate * 1000)
    : undefined;

  const {
    data: performanceTags,
    isLoading: performanceTagsLoading,
    error: performanceTagsGetError,
  } = useTagsGetQuery({
    queryParams: {
      taggedEntityId: performanceId,
      taggedEntityType: TaggedEntityType.PERFORMANCE,
      taggedInEntityType: TaggedInEntityType.POST,
    },
  });

  const taggedPostIds = performanceTags?.map(tag => tag.taggedInEntityId);

  const {
    postsWithAttachmentsAndFiles: taggedPostsList,
    isLoading: taggedPostsLoading,
  } = useGetPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      id: taggedPostIds,
    },
    enabled: taggedPostIds && !!taggedPostIds.length,
  });

  const taggedPosts = taggedPostsList?.length ? taggedPostsList : [];

  const loading =
    (!performance && performanceLoading) ||
    (!performanceTags && performanceTagsLoading) ||
    (!performer && performerLoading) ||
    (!taggedPosts && taggedPostsLoading);

  const error =
    (!performance && performanceGetError) ||
    (!performanceTags && performanceTagsGetError) ||
    (!performer && performerGetError);

  return (
    <>
      {taggedPosts && performer && performance && (
        <>
          <View
            style={{
              ...styles.colContainer,
              padding: APP_GUTTER,
            }}
          >
            <ProfileImage
              size="large"
              imageUrl={performer.imageUrl}
              styles={{ marginBottom: SPACING_XXXSMALL }}
            ></ProfileImage>
            <AppText
              size="large"
              weight="bold"
              marginBottom={SPACING_XXXSMALL}
            >
              {performer.name} @ {performance.venueName}
            </AppText>

            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <SVGIcon
                styles={{ marginRight: SPACING_XXSMALL }}
                height={18}
                width={18}
              >
                <CalendarSVG></CalendarSVG>
              </SVGIcon>

              <AppText marginBottom={SPACING_XXSMALL}>
                {performanceDate?.toLocaleDateString()}
              </AppText>
            </View>
          </View>
          <View
            style={{
              ...styles.headerContainer,
            }}
          ></View>
          {taggedPosts.length === 0 && (
            <AppEmptyState
              primaryMessage="Moments captured by fans"
              secondaryMessage="Be the first to share a video for this performance!"
              onActionPress={handleCreatePostPress}
              actionText="Create a post"
            ></AppEmptyState>
          )}
          {taggedPosts.length > 0 && (
            <ScrollableGalleryLayout
              posts={taggedPosts}
              handleGalleryItemPress={handlePostPress}
            ></ScrollableGalleryLayout>
          )}
        </>
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error</AppText>}
    </>
  );
};

const styles = StyleSheet.create({
  colContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
