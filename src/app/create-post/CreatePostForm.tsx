import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';
import { List } from 'components/list';
import { PerformanceListItem } from 'components/performance-list/PerformanceListItem';
import { PerformerSearch } from 'components/performer-search';
import { PerformerSearchCard } from 'components/performer-search-card';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
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
import { PostFile } from './create-post.types';

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
  postFile: PostFile;
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

  const [showError, setShowError] = React.useState(false);

  const { authState } = useContext(AuthStateContext);
  const { profileState } = useContext(ProfileContext);

  let errorComponent: React.ReactNode | undefined = undefined;

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
    setShowError(true);

    if (!!errorComponent) {
      return Promise.reject();
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
      content: form.caption as string, // submit button only active if caption is defined
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
        taggedEntityId: performer?.id as number, // submit button only active if performer is defined
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
    setShowError(false);
    setPerformer(performer);
  }

  function handleTaggedPerformerPress() {
    setPerformer(undefined);
  }

  function handleErrorActionPress() {
    setShowError(false);
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

  // Note we show the button even if the reuqired performer field hasn't been filled, so we display a clear error message to the user if they try to submit without selecting a performer
  const buttonDisabled =
    isSubmitting || !postFile || !isValid || !dirty || performancesLoading; // Wait until we hacve fetched any performance that matches the artist and show dates before allow user to create post;

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

  let formErrorComponent: React.ReactNode | undefined;
  let createFileErrorComponent: React.ReactNode | undefined;

  // Validate the performer selection. TODO: Create some sort of selection form field which validates the selected input/value using a useEffect hook
  if (!performer) {
    formErrorComponent = (
      <AppError
        message={'You must select an artist to create a post'}
        marginBottom={SPACING_SMALL}
      ></AppError>
    );
  } else {
    formErrorComponent = undefined;
  }

  if (createFileError) {
    let msg = undefined;
    switch (createFileError.error_code) {
      case 'FILE_TOO_LARGE':
        msg =
          'File is too large. Please try again by uploading a shorter video.';
        break;
      case 'UNKNOWN_ERROR':
        msg = 'An unknown error occured';
    }

    createFileErrorComponent = msg ? (
      <AppError
        message={msg}
        onAction={handleErrorActionPress}
        marginBottom={SPACING_SMALL}
      ></AppError>
    ) : undefined;
  } else {
    createFileErrorComponent = undefined;
  }

  if (createFileErrorComponent) {
    errorComponent = createFileErrorComponent;
  } else if (formErrorComponent) {
    errorComponent = formErrorComponent;
  } else {
    errorComponent = undefined;
  }

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
          if (showError) {
            setShowError(false);
          }
          handleCaptionChange(e);
        }}
        handleBlur={(e: any) => {
          if (showError) {
            setShowError(false);
          }
          setShowError(false);
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
            searchTermChanged={term => {
              setPerformerSearchTerm(term);

              if (showError) {
                setShowError(false);
              }
            }}
            searchTerm={performerSearchTerm}
            onPerformerSelected={handlePerformerSelection}
            onTextInputBlur={() => {
              if (showError) {
                setShowError(false);
              }
            }}
            emptyStateMessage="No artists found. Try adjusting your search term"
          ></PerformerSearch>
        )}
        {performer && (
          <PerformerSearchCard
            performer={performer}
            onPress={handleTaggedPerformerPress}
          ></PerformerSearchCard>
        )}
      </View>
      {!!performances?.length && (
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
        {showError && !!errorComponent && errorComponent}
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
