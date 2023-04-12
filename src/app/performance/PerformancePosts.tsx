import { AppText } from 'components/app-text';
import { Gallery } from 'components/gallery';
import { SVGIcon } from 'components/icon';
import { CalendarSVG } from 'components/icon/svg-components';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { Button, Pressable, StyleSheet, View } from 'react-native';
import { useFeaturesGetQuery } from 'store/features/features.queries';
import {
  FeaturedEntityType,
  FeaturerType,
} from 'store/features/features.types';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType } from 'store/tags/tags.types';
import {
  BUTTON_COLOR_PRIMARY,
  COLOR_PRIMARY,
  FONT_WEIGHT_BOLD,
  SPACING_XXSMALL,
} from 'styles';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import { PerformancePostTabs } from './performance-types';

type PerformancePostsProps = {
  performanceId: number;
  performerId: number;
  handleCreatePostPress: () => void;
};

export const PerformancePosts: FC<PerformancePostsProps> = ({
  performanceId,
  performerId,
  handleCreatePostPress,
}) => {
  const [selectedTab, setSelectedTab] = React.useState<PerformancePostTabs>(
    PerformancePostTabs.FAN_CAPTURES,
  );

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

  const {
    data: features,
    isLoading: featuresLoading,
    error: featuresGetError,
  } = useFeaturesGetQuery({
    queryParams: {
      featurerId: performanceId,
      featurerType: FeaturerType.PERFORMANCE,
      featuredEntityType: FeaturedEntityType.POST,
    },
  });

  const featuredPostIds = features?.map(feature => feature.featuredEntityId);

  const {
    postsWithAttachmentsAndFiles: featuredPostsList,
    isLoading: featuredPostsLoading,
  } = useGetPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      id: featuredPostIds,
    },
    enabled: featuredPostIds && !!featuredPostIds.length,
  });

  const featuredPosts = featuredPostsList?.length ? featuredPostsList : [];

  const loading =
    (!performance && performanceLoading) ||
    (!performanceTags && performanceTagsLoading) ||
    (!features && featuresLoading) ||
    (!performer && performerLoading) ||
    (!taggedPosts && taggedPostsLoading) ||
    (!featuredPosts && featuredPostsLoading);

  const error =
    (!performance && performanceGetError) ||
    (!performanceTags && performanceTagsGetError) ||
    (!features && featuresGetError) ||
    (!performer && performerGetError);

  function handleTabSelected(tab: PerformancePostTabs) {
    setSelectedTab(tab);
  }

  return (
    <>
      {featuredPosts && taggedPosts && performer && performance && (
        <View>
          <View style={styles.colContainer}>
            <ProfileImage imageUrl={performer.imageUrl}></ProfileImage>
            <AppText
              size="large"
              weight="bold"
            >
              {performer.name}
            </AppText>
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
          <AppText>
            {taggedPosts.length + featuredPosts.length === 1 &&
              '1 fan has shared a post for this performance'}
            {taggedPosts.length + featuredPosts.length > 1 &&
              `${
                taggedPosts.length + featuredPosts.length
              } fans have shared posts for this performance`}
            {taggedPosts.length + featuredPosts.length === 0 &&
              'No fans have shared posts for this performance. Be the first!'}
          </AppText>
          {taggedPosts.length + featuredPosts.length === 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                onPress={handleCreatePostPress}
                title="Create a Post"
                color={BUTTON_COLOR_PRIMARY}
              ></Button>
            </View>
          )}
          {/* TODO: Make these tabs reusable component along with the styles for it*/}
          <View style={styles.headerContainer}>
            <Pressable
              onPress={() => handleTabSelected(PerformancePostTabs.FEATURED)}
            >
              <AppText weight={FONT_WEIGHT_BOLD}>Featured</AppText>
            </Pressable>
            <Pressable
              onPress={() =>
                handleTabSelected(PerformancePostTabs.FAN_CAPTURES)
              }
            >
              <AppText weight={FONT_WEIGHT_BOLD}>Fan Captures</AppText>
            </Pressable>
          </View>

          {selectedTab === PerformancePostTabs.FEATURED && (
            <Gallery
              postsWithAttachmentsAndFiles={featuredPosts}
              isLoading={featuredPostsLoading}
            ></Gallery>
          )}

          {selectedTab === PerformancePostTabs.FAN_CAPTURES && (
            <Gallery
              postsWithAttachmentsAndFiles={taggedPosts}
              isLoading={taggedPostsLoading}
            ></Gallery>
          )}
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
