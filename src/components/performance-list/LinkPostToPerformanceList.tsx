import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import { CreatePerformanceButton } from 'components/create-performance-button';
import { SVGIcon } from 'components/icon';
import { CheckMarkSVG, PlusSVG } from 'components/icon/svg-components';
import { List, ListItem } from 'components/list';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import {
  useTagCreateMutation,
  useTagDeleteMutation,
  useTagsGetQuery,
} from 'store/tags/tags.queries';
import {
  Tag,
  TaggedEntityType,
  TaggedInEntityType,
} from 'store/tags/tags.types';
import { SPACING_XSMALL } from 'styles';
import { isDefined } from 'utils/utils';

type LinkToPerformancListProps = {
  handleCreatePerformancePress: () => void;
  postId: number;
  performerId: number;
};

export const LinkPostToPerformanceList: FC<LinkToPerformancListProps> = ({
  handleCreatePerformancePress,
  postId,
  performerId,
}) => {
  const { profileState } = useContext(ProfileContext);
  const { profileId: viewingUserId, profileType } = profileState;

  const {
    mutateAsync: createTag,
    isLoading: createTagLoading,
    isError: createTagError,
  } = useTagCreateMutation({
    taggedEntityType: TaggedEntityType.PERFORMANCE,
    taggedInEntityId: postId,
    taggedEntityId: performerId,
  });

  const {
    mutateAsync: deleteTag,
    isLoading: deleteTagLoading,
    isError: deleteTagError,
  } = useTagDeleteMutation({
    taggedEntityType: TaggedEntityType.PERFORMANCE,
    taggedInEntityId: postId,
    taggedEntityId: performerId,
  });

  const {
    data: performances,
    isLoading: performancesLoading,
    error: performancesGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      performerId,
    },
  });

  const { data: performanceTags } = useTagsGetQuery({
    queryParams: {
      taggedInEntityId: postId,
      taggedInEntityType: TaggedInEntityType.POST,
      taggedEntityType: TaggedEntityType.PERFORMANCE,
    },
  });

  const canCreatePerformance =
    profileType === ProfileType.PERFORMER && viewingUserId === performerId;

  const performanceTag = performanceTags?.[0];

  const loading = !performances && performancesLoading;

  const error = !performances && performancesGetError;

  const LinkToPerformanceListItem = ({
    performance,
  }: {
    performance: PerformanceWithEvent;
  }) => {
    const date = new Date(performance.performanceDate * 1000);

    return (
      <ListItem key={performance.id}>
        <Pressable
          style={styles.container}
          onPress={() =>
            performance.id == performanceTag?.taggedEntityId
              ? handleUnlinkToPerformanceIconClick(performanceTag)
              : handleLinkToPerformanceIconClick(performance)
          }
        >
          <AppText marginRight={SPACING_XSMALL}>{`${
            performance.venueName
          } - ${date.toLocaleDateString()}`}</AppText>

          {(!performanceTag ||
            performance.id !== performanceTag.taggedEntityId) && (
            <SVGIcon
              handlePress={() => handleLinkToPerformanceIconClick(performance)}
            >
              <PlusSVG></PlusSVG>
            </SVGIcon>
          )}

          {performance.id == performanceTag?.taggedEntityId && (
            <SVGIcon
              handlePress={() =>
                handleUnlinkToPerformanceIconClick(performanceTag)
              }
            >
              <CheckMarkSVG></CheckMarkSVG>
            </SVGIcon>
          )}
        </Pressable>
      </ListItem>
    );
  };

  async function handleLinkToPerformanceIconClick(
    performance: PerformanceWithEvent,
  ) {
    // If performance tag was already selected, delete the tag associated with it before creating new one
    if (isDefined(performanceTag)) {
      await deleteTag({ id: performanceTag.id });
    }

    await createTag({
      taggedEntityId: performance.id,
      taggedEntityType: TaggedEntityType.PERFORMANCE,
      taggedInEntityId: postId,
      taggedInEntityType: TaggedInEntityType.POST,
    });
  }

  async function handleUnlinkToPerformanceIconClick(performanceTag: Tag) {
    await deleteTag({ id: performanceTag.id });
  }

  return (
    <>
      {performances && performanceTags && !!performances.length && (
        <>
          {canCreatePerformance && (
            <CreatePerformanceButton
              onPress={handleCreatePerformancePress}
            ></CreatePerformanceButton>
          )}
          <List
            sidePadding="xxxsmall"
            verticalPadding="xxxsmall"
            scrollable={true}
          >
            {performances?.map(performance => (
              <LinkToPerformanceListItem
                performance={performance}
              ></LinkToPerformanceListItem>
            ))}
          </List>
        </>
      )}
      {performances && !performances.length && (
        <>
          <AppText>No performances found</AppText>
          {canCreatePerformance && (
            <AppButton
              handlePress={handleCreatePerformancePress}
              text="Create Performance"
            ></AppButton>
          )}
        </>
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error...</AppText>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
