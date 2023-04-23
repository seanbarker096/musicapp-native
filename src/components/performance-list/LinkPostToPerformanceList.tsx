import { AppText } from 'components/app-text';
import { CreatePerformanceButton } from 'components/create-performance-button';
import { SVGIcon } from 'components/icon';
import { CheckMarkSVG, PlusSVG } from 'components/icon/svg-components';
import { List, ListItem } from 'components/list';
import { ProfileContext } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import { SPACING_XSMALL } from 'styles';

type LinkToPerformancListProps = {
  handleCreatePerformancePress: () => void;
  postId: number;
};

/**
 * Component which renders a list of all performances a performer can link another users post too.
 *
 * NOTE: This should only be visible to performers, and that is assumed in the component logic (i.e. we don't check
 * to see if the profileType is a performer)
 */
export const LinkPostToPerformanceList: FC<LinkToPerformancListProps> = ({
  handleCreatePerformancePress,
  postId,
}) => {
  const { profileState } = useContext(ProfileContext);
  const { profileId: loggedInUserProfileId } = profileState;

  const {
    data: performances,
    isLoading: performancesLoading,
    error: performancesGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      performerId: loggedInUserProfileId,
    },
  });

  const { data: performanceTags } = useTagsGetQuery({
    queryParams: {
      taggedInEntityId: postId,
      taggedInEntityType: TaggedInEntityType.POST,
      taggedEntityType: TaggedEntityType.PERFORMANCE,
    },
  });

  const performanceTag = performanceTags?.[0];

  const loading = !performances && performancesLoading;

  const error = !performances && performancesGetError;

  console.log(performanceTag);

  const LinkToPerformanceListItem = ({
    performance,
  }: {
    performance: PerformanceWithEvent;
  }) => {
    const date = new Date(performance.performanceDate * 1000);

    console.log(performance);

    return (
      <ListItem key={performance.id}>
        <View style={styles.container}>
          <AppText marginRight={SPACING_XSMALL}>{`${
            performance.venueName
          } ${date.toLocaleDateString()}`}</AppText>
          {!performanceTag ||
            (performance.id !== performanceTag.taggedEntityId && (
              <SVGIcon handlePress={handleLinkToPerformanceIconClick}>
                <PlusSVG></PlusSVG>
              </SVGIcon>
            ))}
          {performance.id == performanceTag?.taggedEntityId && (
            <SVGIcon handlePress={handleUnlinkToPerformanceIconClick}>
              <CheckMarkSVG></CheckMarkSVG>
            </SVGIcon>
          )}
        </View>
      </ListItem>
    );
  };

  function handleLinkToPerformanceIconClick() {}

  function handleUnlinkToPerformanceIconClick() {}

  return (
    <>
      <CreatePerformanceButton
        onPress={handleCreatePerformancePress}
      ></CreatePerformanceButton>
      {performances && performanceTags && performances.length && (
        <>
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
