import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppEmptyState } from 'components/app-empty-state';
import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileContext } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import {
  APP_GUTTER,
  COLOR_PRIMARY,
  SPACING_LARGE,
  SPACING_SMALL,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import { ManageStackParamList } from './manage-types';

export type ManageTaggedPostProps = NativeStackScreenProps<
  ManageStackParamList,
  'ManageTaggedPosts'
>;

/**
 * Should only be visible for performers
 */
export const ManageTaggedPosts: FC<ManageTaggedPostProps> = ({
  navigation,
}) => {
  const profileState = useContext(ProfileContext);
  const { profileId, profileType } = profileState.profileState;

  const {
    data: postTags,
    isLoading: postTagsLoading,
    error: postTagsGetError,
  } = useTagsGetQuery({
    queryParams: {
      taggedEntityType: TaggedEntityType.PERFORMER,
      taggedEntityId: profileId,
      taggedInEntityType: TaggedInEntityType.POST,
      onlySingleTaggedEntityType: true,
    },
  });

  const postIds = postTags && postTags.map(postTag => postTag.taggedInEntityId);

  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetPostsWithAttachmentsAndFilesQuery({
      queryParams: {
        id: postIds,
      },
      enabled: !!postIds && postIds.length > 0,
    });

  const loading =
    !postsWithAttachmentsAndFiles && (postTagsLoading || postsLoading);

  const error = !postsWithAttachmentsAndFiles && postTagsGetError;

  function handleCreatePerformancePress() {
    navigation.navigate('ManageCreatePerformance');
  }
  return (
    <>
      {postTags && postTags.length > 0 && postsWithAttachmentsAndFiles && (
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
              weight="bold"
              size="large"
              marginBottom={SPACING_XXXSMALL}
            >
              Showcase You gigs
            </AppText>
            <AppText marginBottom={SPACING_SMALL}>
              Here are all your fan's videos that are not linked to any of your
              gigs. View one to link it to one of your gigs.
            </AppText>

            <View style={{ flexDirection: 'row' }}>
              <AppText marginRight={SPACING_XXXSMALL}>
                Don't have a gig yet?
              </AppText>
              <AppText
                isLink={true}
                handlePress={handleCreatePerformancePress}
              >
                Create a gig
              </AppText>
            </View>
          </View>

          <View
            style={{
              ...styles.headerContainer,
            }}
          ></View>

          <ScrollableGalleryLayout
            posts={postsWithAttachmentsAndFiles}
            handleGalleryItemPress={postId =>
              navigation.navigate('ViewPost', { postId })
            }
          ></ScrollableGalleryLayout>
        </>
      )}
      {postTags && postTags.length === 0 && (
        <AppEmptyState
          primaryMessage="There aren't any fan videos left for you to link to your
          gigs."
          secondaryMessage="You will see more of your fans videos if you create gigs. Once a video is linked to your gig, you'll be able to see it here, and on your profile."
          actionText="Create a gig"
          headingSize="large"
          bodyTextSize="regular"
          onActionPress={handleCreatePerformancePress}
        ></AppEmptyState>
      )}

      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error</AppText>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
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


