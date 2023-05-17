import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';
import { List } from 'components/list';
import { PerformanceListItem } from 'components/performance-list/PerformanceListItem';
import { PerformerSearch } from 'components/performer-search';
import { PerformerSearchCard } from 'components/performer-search-card';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import React, { FC, useContext, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useFileCreateMutation } from 'store/files/files.queries';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { performancesKeys } from 'store/performances/performances.query-keys';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { Performer } from 'store/performers';
import { PostOwnerType, usePostCreateMutation } from 'store/posts';
import { useTagCreateMutation } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import { useUserGetQuery } from 'store/users';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_LARGE,
  SPACING_SMALL,
  SPACING_XSMALL,
} from 'styles';
import * as Yup from 'yup';

interface PostFile {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string | undefined;
  fileName: string | undefined;
  blob: Blob;
}

interface PostCreateFormValues {
  caption: string | undefined;
}

const createPostFormSchema = Yup.object({
  caption: Yup.string()
    .required('Required')
    .max(1000, 'Caption must be 1000 characters or less'),
});

interface CreatePostFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  removePostFile: () => void;
  postFile: PostFile | undefined;
}

export const CreatePostForm: FC<CreatePostFormProps> = ({
  onCancel,
  onSuccess,
  removePostFile,
  postFile,
}) => {
  const [performer, setPerformer] = useState<Performer | undefined>(undefined);
  const [performerSearchTerm, setPerformerSearchTerm] = useState<
    string | undefined
  >(undefined);
  const [selectedPerformance, setSelectedPerformance] = useState<
    PerformanceWithEvent | undefined
  >(undefined);

  const [showErrorMessage, setShowErrorMessage] = React.useState(false);

  const { authState } = useContext(AuthStateContext);
  const { profileState } = useContext(ProfileContext);

  const userId = authState.authUser.userId;
  const postOwnerType =
    profileState.profileType === ProfileType.PERFORMER
      ? PostOwnerType.PERFORMER
      : PostOwnerType.USER;

  const { mutateAsync: createPost } = usePostCreateMutation({
    ownerId: userId,
    ownerType: postOwnerType,
    queryKeysToInvalidate: [
      performer
        ? performancesKeys.performancesByPerformerIds([performer.id])
        : [],
      performer
        ? performancesKeys.attendeePerformancesByPerformerIds(
            [performer.id],
            [userId],
          )
        : [],
    ],
  });

  const {
    mutateAsync: createFile,
    data: createdFile,
    isLoading: createFileLoading,
    error: createFileError,
  } = useFileCreateMutation();

  let errorMessage;

  switch (createFileError?.error_code) {
    case 'FILE_TOO_LARGE':
      errorMessage =
        'File is too large. Please try again by uploading a shorter video.';
      break;
    case 'UNKNOWN_ERROR':
      errorMessage = 'Unknown error';
    default:
      errorMessage = undefined;
  }

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
    isLoading: performancesLoading,
    isError: performancesError,
    data: performances,
    error: performancesGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      performerId: performer?.id,
    },
    enabled: !!performer,
  });

  const handleFormSubmit = async function (form: PostCreateFormValues) {
    setShowErrorMessage(true);
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

    if (!performer || !form.caption) {
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
      ownerType: postOwnerType,
      content: form.caption,
      attachmentFileIds: [fileResult.file.id],
    });

    const createdPost = postResult && postResult.post;

    if (!createdPost) {
      throw Error('failed to create post');
    }

    // if no performance found for the artist, tag the artist in the post so they cna view it later
    let tagResult;
    if (!selectedPerformance) {
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
        taggedEntityId: selectedPerformance.id,
        taggedInEntityType: TaggedInEntityType.POST,
        taggedInEntityId: createdPost.id,
      });
    }

    if (!tagResult) {
      throw Error('Failed to create tag');
    }

    onSuccess();
  };

  function handlePerformerSelection(performer: Performer) {
    setPerformer(performer);
  }

  function handleTaggedPerformerPress() {
    setPerformer(undefined);
  }

  function handleErrorActionPress() {
    setShowErrorMessage(false);
    removePostFile();
  }

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    validationSchema: createPostFormSchema,
    initialValues: { caption: '' },
    onSubmit: handleFormSubmit,
  });

  const handleCaptionBlur = handleBlur('caption');

  const handleCaptionChange = handleChange('caption');

  const buttonDisabled =
    isSubmitting ||
    !postFile ||
    !performer ||
    !isValid ||
    !dirty ||
    performancesLoading; // Wait until we hacve fetched any performance that matches the artist and show dates before allow user to create post;

  // <Placeholder
  //   Animation={props => (
  //     <Shine
  //       {...props}
  //       reverse={false}
  //     ></Shine>
  //   )}
  // >
  //   <View style={{ ...styles.flexRowContainer }}>
  //     <PlaceholderMedia
  //       isRound={true}
  //       size={48}
  //       style={{ marginRight: SPACING_XXSMALL }}
  //     ></PlaceholderMedia>
  //     <PlaceholderLine
  //       height={20}
  //       width={40}
  //       noMargin={true}
  //     />
  //   </View>
  // </Placeholder>

  return (
    <View
      style={{
        ...styles.flexColumnContainer,
        width: '100%',
        height: '100%',
        marginBottom: SPACING_LARGE,
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
      </View>
      <AppTextInput
        handleChange={(e: string | React.ChangeEvent<any>) => {
          handleCaptionChange(e);
        }}
        handleBlur={(e: any) => {
          handleCaptionBlur(e);
        }}
        value={values.caption}
        placeholder="Write a caption"
        error={errors.caption}
        touched={touched.caption}
        marginBottom={SPACING_XSMALL}
      />
      <View
        style={{
          ...styles.flexColumnContainer,
          height: !performer ? 200 : 'auto',
          marginBottom: SPACING_XSMALL,
        }}
      >
        <Text style={{ width: '100%' }}>
          Tag the artist so they see your video
        </Text>
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
      {performances && (
        <>
          {selectedPerformance && (
            <PerformanceListItem
              performances={selectedPerformance}
              onListItemPress={() => setSelectedPerformance(undefined)}
            ></PerformanceListItem>
          )}
          {!selectedPerformance && (
            <View style={{ width: '70%' }}>
              <View
                style={{
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 3,
                }}
              >
                <AppText>Select the artist's performance</AppText>
              </View>
              <List>
                {performances.map(performance => (
                  <PerformanceListItem
                    key={performance.id}
                    performances={performance}
                    onListItemPress={setSelectedPerformance}
                  ></PerformanceListItem>
                ))}
              </List>
            </View>
          )}
        </>
      )}
      <View
        style={{
          marginTop: 'auto',
          marginBottom: SPACING_SMALL,
          width: '100%',
        }}
      >
        {showErrorMessage && errorMessage && (
          <AppError
            message={errorMessage}
            onAction={createFileError ? handleErrorActionPress : undefined}
            marginBottom={SPACING_SMALL}
          ></AppError>
        )}
        <View
          style={{
            ...styles.flexRowContainer,
          }}
        >
          <View
            style={{
              flexGrow: 1,
              flexShrink: 0,
              marginRight: SPACING_SMALL,
            }}
          >
            <AppButton
              color={BUTTON_COLOR_DISABLED}
              text="Cancel"
              handlePress={onCancel}
            ></AppButton>
          </View>
          <View
            style={{
              flexGrow: 1,
              flexShrink: 0,
            }}
          >
            <AppButton
              color={BUTTON_COLOR_PRIMARY}
              disabled={buttonDisabled}
              text="Share"
              handlePress={handleSubmit}
            ></AppButton>
          </View>
        </View>
      </View>
    </View>
  );
};

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
