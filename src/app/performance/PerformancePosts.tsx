import { AppText } from 'components/app-text';
import { Gallery } from 'components/gallery';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFeaturesGetQuery } from 'store/features/features.queries';
import { FeaturerType } from 'store/features/features.types';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType } from 'store/tags/tags.types';
import { COLOR_PRIMARY, FONT_WEIGHT_BOLD, SPACING_XXSMALL } from 'styles';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import { PerformancePostTabs } from './performance-types';

type PerformancePostsProps = {
  performanceId: number;
};

export const PerformancePosts: FC<PerformancePostsProps> = ({
  performanceId,
}) => {
  const [selectedTab, setSelectedTab] = React.useState<PerformancePostTabs>(
    PerformancePostTabs.FAN_CAPTURES,
  );

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

  const loading = !performanceTags && performanceTagsLoading;
  const error = !performanceTags && performanceTagsGetError;

  const taggedPostIds = performanceTags?.map(tag => tag.taggedInEntityId);

  const {
    postsWithAttachmentsAndFiles: taggedPosts,
    isLoading: taggedPostsLoading,
  } = useGetPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      id: taggedPostIds,
    },
    enabled: !!taggedPostIds,
  });

  const {
    data: features,
    isLoading: featuresLoading,
    error: featuresGetError,
  } = useFeaturesGetQuery({
    queryParams: {
      featurerId: performanceId,
      featurerType: FeaturerType.PERFORMANCE,
    },
  });

  const featuredPostIds = features?.map(feature => feature.featuredEntityId);

  const {
    postsWithAttachmentsAndFiles: featuredPosts,
    isLoading: featuredPostsLoading,
  } = useGetPostsWithAttachmentsAndFilesQuery({
    queryParams: {
      id: featuredPostIds,
    },
    enabled: !!featuredPostIds,
  });

  function handleTabSelected(tab: PerformancePostTabs) {
    setSelectedTab(tab);
  }

  return (
    <>
      {featuredPosts && taggedPosts && (
        <View>
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
