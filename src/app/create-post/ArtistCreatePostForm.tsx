import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import { CreatePerformanceButton } from 'components/create-performance-button';
import { AppTextInput } from 'components/form-components';
import { List } from 'components/list';
import { PerformanceListItem } from 'components/performance-list/PerformanceListItem';
import { ProfileContext } from 'contexts/profile.context';
import { useFormik } from 'formik';
import React, { FC, useContext, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useFileCreateMutation } from 'store/files/files.queries';
import { usePerformancesGetQuery } from 'store/performances/performances.queries';
import { performancesKeys } from 'store/performances/performances.query-keys';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { PostOwnerType, usePostCreateMutation } from 'store/posts';
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

interface ArtistCreatePostFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  removePostFile: () => void;
  handleCreatePerformancePress: () => void;
  postFile: PostFile;
}

export const ArtistCreatePostForm: FC<ArtistCreatePostFormProps> = ({
  onCancel,
  onSuccess,
  removePostFile,
  handleCreatePerformancePress,
  postFile,
}) => {
  const [selectedPerformance, setSelectedPerformance] = useState<
    PerformanceWithEvent | undefined
  >(undefined);

  const [showError, setShowError] = React.useState(false);

  const { profileState } = useContext(ProfileContext);

  let errorComponent: React.ReactNode | undefined = undefined;

  const { mutateAsync: createPost } = usePostCreateMutation({
    ownerId: profileState.profileId,
    ownerType: PostOwnerType.PERFORMER,
    queryKeysToInvalidate: [
      performancesKeys.performancesByPerformerIds([profileState.profileId]),
    ],
  });

  const {
    mutateAsync: createFile,
    data: createdFile,
    isLoading: createFileLoading,
    error: createFileError,
  } = useFileCreateMutation();

  const {
    isLoading: performancesLoading,
    isError: performancesError,
    data: performances,
    error: performancesGetError,
  } = usePerformancesGetQuery({
    queryParams: {
      performerId: profileState.profileId,
    },
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
      ownerId: profileState.profileId,
      ownerType: PostOwnerType.PERFORMER,
      content: form.caption as string, // submit button only active if caption is defined
      attachmentFileIds: [fileResult.file.id],
    });

    const createdPost = postResult && postResult.post;

    if (!createdPost) {
      throw Error('failed to create post');
    }

    onSuccess();
  };

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
                <AppText>
                  Select or create a performance to link to your post
                </AppText>
              </View>
              <CreatePerformanceButton
                onPress={handleCreatePerformancePress}
              ></CreatePerformanceButton>
              {performances.length && (
                <List>
                  {performances.map(performance => (
                    <PerformanceListItem
                      key={performance.id}
                      performances={performance}
                      onListItemPress={setSelectedPerformance}
                    ></PerformanceListItem>
                  ))}
                </List>
              )}
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
