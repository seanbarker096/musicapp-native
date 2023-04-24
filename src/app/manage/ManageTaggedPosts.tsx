import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { Gallery } from 'components/gallery';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { PostOwnerType } from 'store/posts';
import { useTagsGetQuery } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import {
  BUTTON_COLOR_PRIMARY,
  SPACING_LARGE,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXXSMALL,
} from 'styles';
import { useGetPostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';
import { ManageStackParamList } from './manage-types';

export type ManageTaggedPostProps = NativeStackScreenProps<
  ManageStackParamList,
  'ManageTaggedPosts'
>;

export const ManageTaggedPosts: FC<ManageTaggedPostProps> = ({
  navigation,
}) => {
  const profileState = useContext(ProfileContext);
  const { profileId, profileType } = profileState.profileState;

  const taggedEntityType =
    profileType === ProfileType.PERFORMER
      ? TaggedEntityType.PERFORMER
      : TaggedEntityType.USER;

  const {
    data: postTags,
    isLoading: postTagsLoading,
    error: postTagsGetError,
  } = useTagsGetQuery({
    queryParams: {
      taggedEntityType: taggedEntityType,
      taggedEntityId: profileId,
      taggedInEntityType: TaggedInEntityType.POST,
      onlySingleTaggedEntityType: true,
    },
  });

  const postIds = postTags && postTags.map(postTag => postTag.taggedInEntityId);

  const postOwnerType =
    profileType === ProfileType.PERFORMER
      ? PostOwnerType.PERFORMER
      : PostOwnerType.USER;

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
        <View style={styles.container}>
          <AppText
            weight={'bold'}
            size="large"
            marginBottom={SPACING_XXXSMALL}
          >
            Showcase Your Performances
          </AppText>
          <AppText marginBottom={SPACING_SMALL}>
            Here are all your fan's videos that are not linked to any of your
            performances. Showcase these videos to other fans and users by
            adding them to a performance.
          </AppText>

          <View style={{ marginBottom: SPACING_LARGE }}>
            <Button
              color={BUTTON_COLOR_PRIMARY}
              onPress={handleCreatePerformancePress}
              title="Create a Performance"
            ></Button>
          </View>
          <Gallery
            postsWithAttachmentsAndFiles={postsWithAttachmentsAndFiles}
            isLoading={false}
          ></Gallery>
        </View>
      )}
      {postTags && postTags.length === 0 && (
        <View style={styles.container}>
          <AppText
            weight={'bold'}
            size="regular"
            marginBottom={SPACING_XSMALL}
          >
            There aren't any fan videos left for you to add to your
            performances.
          </AppText>
          <AppText marginBottom={SPACING_SMALL}>
            Save yourself time, and showcase your fan's videos. Create
            performances so that fans can add their videos to them.
          </AppText>
          <Button
            color={BUTTON_COLOR_PRIMARY}
            onPress={handleCreatePerformancePress}
            title="Create a Performance"
          ></Button>
        </View>
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
});


