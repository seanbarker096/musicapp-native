import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { SVGIcon } from 'components/icon';
import { CalendarSVG } from 'components/icon/svg-components';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import { BUTTON_COLOR_PRIMARY, COLOR_PRIMARY, SPACING_XXSMALL } from 'styles';
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
        <View>
          <View style={styles.colContainer}>
            <ProfileImage imageUrl={performer.imageUrl}></ProfileImage>
            <AppText
              size="large"
              weight="bold"
            >
              {performer.name}
            </AppText>
            <AppText>{performance.venueName}</AppText>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <SVGIcon
                styles={{ marginRight: SPACING_XXSMALL }}
                height={18}
                width={18}
              >
                <CalendarSVG></CalendarSVG>
              </SVGIcon>

              <AppText>{performanceDate?.toLocaleDateString()}</AppText>
            </View>
          </View>
          {taggedPosts.length === 0 && (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <AppText>
                No fans have shared videos for this performance yet. Be the
                first!
              </AppText>
              {!loggedInUserIsPerformer && (
                <Button
                  onPress={handleCreatePostPress}
                  title="Create a Post"
                  color={BUTTON_COLOR_PRIMARY}
                ></Button>
              )}
            </View>
          )}
          <ScrollableGalleryLayout
            posts={taggedPosts}
            handleGalleryItemPress={handlePostPress}
          ></ScrollableGalleryLayout>
        </View>
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
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: SPACING_XXSMALL,
    paddingBottom: SPACING_XXSMALL,
    width: '100%',
  },
});
