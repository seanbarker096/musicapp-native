import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { AppText } from 'components/app-text';
import { PerformerSearch } from 'components/performer-search';
import { PerformerSearchCard } from 'components/performer-search-card';
import { ProfileImage } from 'components/profile-image';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React, { FC, useContext, useState } from 'react';
import {
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Shine,
} from 'rn-placeholder';
import { AuthStateContext } from 'store/auth/auth.contexts';
import {
  useFileCreateMutation,
  useFilesGetQuery,
} from 'store/files/files.queries';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { Performer } from 'store/performers';
import { PostOwnerType, usePostCreateMutation } from 'store/posts';
import { useTagCreateMutation } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import { useUserGetQuery } from 'store/users';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXSMALL,
} from 'styles';
import { toNumber } from 'utils/utils';
import { CreatePostStackScreenProps } from './create-post.types';

interface PostFile {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string | undefined;
  fileName: string | undefined;
  blob: Blob;
}

interface PostCreateFormValues {
  caption: string | undefined;
}

export const CreatePost: FC<CreatePostStackScreenProps> = ({
  navigation,
}: CreatePostStackScreenProps) => {
  const [postFile, setPostFile] = useState<PostFile | undefined>(undefined);
  const [performer, setPerformer] = useState<Performer | undefined>(undefined);
  const [performanceDate, setPerformanceDate] = useState<Date | undefined>(
    undefined,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [performerSearchTerm, setPerformerSearchTerm] = useState<
    string | undefined
  >(undefined);

  const { authState } = useContext(AuthStateContext);

  const userId = authState.authUser.userId;

  const { mutateAsync: createPost } = usePostCreateMutation({
    ownerId: userId,
  });

  const today = new Date();

  const {
    mutateAsync: createFile,
    data: createdFile,
    isLoading: createFileLoading,
    isError: createFileError,
  } = useFileCreateMutation();

  const {
    mutateAsync: createTag,
    isLoading: createTagLoading,
    isError: createTagError,
  } = useTagCreateMutation();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserGetError,
  } = useUserGetQuery({ queryParams: { id: userId } });

  const postCreator = user && user[0];

  const {
    isLoading: filesGetLoading,
    isError: isFilesGetError,
    data: files,
    error: filesGetError,
  } = useFilesGetQuery({
    queryParams: { uuid: postCreator ? postCreator.avatarFileUuid : undefined },
    enabled: !isUserLoading,
  });

  const avatarFile = files && files[0];

  const {
    isLoading: performancesLoading,
    isError: performancesError,
    data: performances,
    error: performancesGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      performerId: performer?.id,
      performanceDate: toNumber(
        performanceDate
          ? Math.ceil(performanceDate.getTime() / 1000)
          : undefined,
      ),
    },
    enabled: !!performer && !!performanceDate,
  });

  const performance = performances && performances[0];

  useFocusEffect(
    React.useCallback(() => {
      const _openMediaLibrary = async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        const response = await ImagePicker.getMediaLibraryPermissionsAsync();

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: false,
          quality: 1,
        });

        if (result.cancelled) {
          return;
        }

        if (!result.cancelled) {
          const file = await fetch(result.uri);

          const blob = await file.blob();

          setPostFile({
            imageInfo: result,
            mimeType: blob.type,
            fileName: `${userId}-${Date.now()}`,
            blob,
          });
        }
      };

      _openMediaLibrary();

      return () => {
        setPostFile(undefined);
      };
    }, []),
  );

  const handleFormSubmit = async function (form: PostCreateFormValues) {
    // TODO DISABLE BUTTON if file not defined
    if (!userId) {
      throw Error('userId undefined when trying to create a post');
    }
    if (!postFile) {
      throw Error('Post file not correctly defined when submit pressed');
    }

    if (!postFile.fileName) {
      throw Error('filename not defined');
    }

    if (!postFile.mimeType || postFile.mimeType === '') {
      throw Error('mime type not defined');
    }

    if (!performer || !form.caption || !performanceDate) {
      throw Error('Form incomplete. At least one required field is undefined');
    }

    const fileResult = await createFile({
      fileName: postFile.fileName,
      file: postFile.blob,
      mimeType: postFile.mimeType,
      uri: postFile.imageInfo.uri,
    });

    if (!fileResult) {
      throw Error('create file request failed');
    }

    const postResult = await createPost({
      ownerId: userId,
      ownerType: PostOwnerType.USER, // todo: update this
      content: form.caption,
      attachmentFileIds: [fileResult.file.id],
    });

    const createdPost = postResult && postResult.post;

    if (!createdPost) {
      throw Error('failed to create post');
    }

    // if no performance found for the artist and show dates, tag the artist in the post so they cna view it later
    let tagResult;
    if (!performance) {
      tagResult = await createTag({
        taggedEntityType: TaggedEntityType.PERFORMER,
        taggedEntityId: performer.id,
        taggedInEntityType: TaggedInEntityType.POST,
        taggedInEntityId: createdPost.id,
      });
    } else {
      // Otherwise tag the post with the performance
      tagResult = await createTag({
        taggedEntityType: TaggedEntityType.PERFORMANCE,
        taggedEntityId: performance.id,
        taggedInEntityType: TaggedInEntityType.POST,
        taggedInEntityId: createdPost.id,
      });
    }

    if (!tagResult) {
      throw Error('Failed to create tag');
    }

    navigation.navigate(PrimaryScreens.PROFILE);
  };

  const handleCancelClick = function () {
    console.log('cancelled');
  };

  function handlePerformerSelection(performer: Performer) {
    setPerformer(performer);
  }

  function handleTaggedPerformerPress() {
    setPerformer(undefined);
  }

  // TODO: Create a date input component because i am reusing this logic in CreatePerformance
  function handleDateInputPress() {
    console.log('date input pressed');
    console.log(Platform.OS);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: performanceDate ?? today,
        onChange: handlePerformanceDateChange,
        mode: 'date',
        is24Hour: true,
      });
    } else {
      setShowDatePicker(true);
    }
  }

  function handlePerformanceDateChange(
    event: DateTimePickerEvent,
    date?: Date,
  ) {
    if (event.type === 'set') {
      setPerformanceDate(date);
    }

    setShowDatePicker(false);
  }

  // Todo: make a resuable component as also used in Post. Make it fetch the user and the file
  // after taking in a userId
  const UserHeader =
    postCreator && avatarFile ? (
      <>
        <ProfileImage
          size="small"
          styles={{ marginRight: SPACING_XXSMALL }}
          imageUrl={avatarFile.url}
        ></ProfileImage>
        <AppText size="large">{postCreator.username}</AppText>
      </>
    ) : (
      <Placeholder
        Animation={props => (
          <Shine
            {...props}
            reverse={false}
          ></Shine>
        )}
      >
        <View style={{ ...styles.flexRowContainer }}>
          <PlaceholderMedia
            isRound={true}
            size={48}
            style={{ marginRight: SPACING_XXSMALL }}
          ></PlaceholderMedia>
          <PlaceholderLine
            height={20}
            width={40}
            noMargin={true}
          />
        </View>
      </Placeholder>
    );

  return (
    <>
      {postFile && (
        <Formik
          initialValues={{
            performerId: undefined,
            caption: '',
          }}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View
              style={{
                ...styles.flexColumnContainer,
                width: '100%',
                height: '100%',
                paddingBottom: SPACING_SMALL,
              }}
            >
              <View style={{ ...styles.flexRowContainer }}>
                <Image
                  source={{
                    uri: postFile?.imageInfo.uri,
                    width: 150,
                    height: 150,
                  }}
                ></Image>
                <View
                  style={{
                    ...styles.flexColumnContainer,
                    padding: SPACING_XSMALL,
                  }}
                >
                  <View
                    style={{
                      ...styles.flexRowContainer,
                    }}
                  >
                    {UserHeader}
                  </View>
                  <Text>Event date</Text>
                  <TextInput
                    style={{
                      width: '100%',
                      display: 'flex',
                      ...styles.textInput,
                    }}
                    onPressIn={handleDateInputPress}
                    value={
                      performanceDate
                        ? performanceDate.toLocaleDateString()
                        : undefined
                    }
                    placeholder="DD/MM/YYYY"
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      value={performanceDate ?? today}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={handlePerformanceDateChange}
                    />
                  )}
                </View>
              </View>
              <TextInput
                style={{ width: '100%', ...styles.textInput }}
                onChangeText={handleChange('caption')}
                onBlur={handleBlur('caption')}
                value={values.caption}
                placeholder="Write a caption..."
              />
              <View style={{ ...styles.flexColumnContainer, height: 200 }}>
                <Text style={{ width: '100%' }}>Performer</Text>
                {!performer && (
                  <PerformerSearch
                    searchTermChanged={setPerformerSearchTerm}
                    searchTerm={performerSearchTerm}
                    onPerformerSelected={handlePerformerSelection}
                  ></PerformerSearch>
                )}
                {performer && (
                  <PerformerSearchCard
                    performer={performer}
                    onPress={handleTaggedPerformerPress}
                  ></PerformerSearchCard>
                )}
              </View>
              <View
                style={{
                  ...styles.flexRowContainer,
                  marginTop: 'auto',
                }}
              >
                <View
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                    marginRight: SPACING_SMALL,
                  }}
                >
                  <Button
                    color={BUTTON_COLOR_DISABLED}
                    onPress={handleCancelClick}
                    title="Cancel"
                  ></Button>
                </View>
                <View
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                  }}
                >
                  <Button
                    color={BUTTON_COLOR_PRIMARY}
                    disabled={performancesLoading} // Wait until we hacve fetched any performance that matches the artist and show dates before allow user to create post
                    onPress={handleSubmit}
                    title="Share"
                  />
                </View>
              </View>
            </View>
          )}
        </Formik>
      )}
    </>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  flexColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  flexRowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInput: {},
});