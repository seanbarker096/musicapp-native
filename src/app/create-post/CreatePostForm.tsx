import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';
import { IconColor, SVGIcon } from 'components/icon';
import { LocationSVG, PictureSVG } from 'components/icon/svg-components';
import { PerformerSearchCard } from 'components/performer-search-card';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useFormik } from 'formik';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useFileCreateMutation } from 'store/files/files.queries';
import { FileCreateResult } from 'store/files/files.types';
import { performancesKeys } from 'store/performances/performances.query-keys';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { Performer } from 'store/performers';
import { PostOwnerType, usePostCreateMutation } from 'store/posts';
import { useTagCreateMutation } from 'store/tags/tags.queries';
import { TaggedEntityType, TaggedInEntityType } from 'store/tags/tags.types';
import {
  APP_GUTTER,
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  COLOR_NEUTRAL_XXLIGHT,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';
import * as Yup from 'yup';
import { PostFile } from './create-post.types';

interface PostCreateFormValues {
  caption: string | undefined;
}

const createPostFormSchema = Yup.object({
  caption: Yup.string().max(1000, 'Caption must be 1000 characters or less'),
});

interface CreatePostFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  removePostFile: () => void;
  postFile: PostFile;
  performer?: Performer;
  performance?: PerformanceWithEvent;
  handlSearchForPerformerPress: () => void;
  handleSelectPerformancePress: () => void;
}

// todo: rename to UserCreatePostForm and simplify logic accordingly
export const CreatePostForm: FC<CreatePostFormProps> = ({
  onCancel,
  onSuccess,
  removePostFile,
  postFile,
  performer,
  performance,
  handlSearchForPerformerPress,
  handleSelectPerformancePress,
}) => {
  const [showError, setShowError] = React.useState(false);

  const [thumbnailUri, setThumbnailUri] = useState<string | undefined>(
    undefined,
  );

  const [thumbnailLoading, setThumbnailLoading] = useState(true);

  const { authState } = useContext(AuthStateContext);

  let errorComponent: React.ReactNode | undefined = undefined;

  const userId = authState.authUser.userId;

  useEffect(() => {
    const _extractThumbnail = async () => {
      try {
        setThumbnailLoading(true);
        const result = await VideoThumbnails.getThumbnailAsync(
          postFile.imageInfo.uri,
          {
            time: 0,
          },
        );
        setThumbnailUri(result.uri);
        setThumbnailLoading(false);
      } catch (e) {
        console.warn(e);
        setThumbnailLoading(false);
      }
    };
    _extractThumbnail();
  }, [postFile]);

  const LoadingThumbnail = () => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <ActivityIndicator
        size="small"
        color="#000000"
      />
    </View>
  );

  const { mutateAsync: createPost } = usePostCreateMutation({
    ownerId: userId,
    ownerType: PostOwnerType.USER,
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

    let attachmentThumbnailResult: FileCreateResult | undefined = undefined;

    if (thumbnailUri) {
      const thumbnailFile = await fetch(thumbnailUri);

      const thumbnailBlob = await thumbnailFile.blob();

      attachmentThumbnailResult = await createFile({
        fileName: `${postFile.fileName}-thumbnail`,
        file: thumbnailBlob,
        mimeType: thumbnailBlob.type,
        uri: thumbnailUri,
      });
    }

    if (!fileResult) {
      throw Error('create file request failed');
    }

    const postResult = await createPost({
      ownerId: userId,
      ownerType: PostOwnerType.USER,
      content: form.caption as string, // submit button only active if caption is defined
      attachmentFiles: [
        {
          attachmentFileId: fileResult.file.id,
          thumbnailFileId: attachmentThumbnailResult?.file.id,
        },
      ],
    });

    const createdPost = postResult && postResult.post;

    if (!createdPost) {
      throw Error('failed to create post');
    }

    // if no performance found for the artist, tag the artist in the post so they cna view it later
    let tagResult;
    if (!performance) {
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
        taggedEntityId: performance.id,
        taggedInEntityType: TaggedInEntityType.POST,
        taggedInEntityId: createdPost.id,
      });
    }

    if (!tagResult) {
      throw Error('Failed to create tag');
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
    initialValues: { caption: undefined },
    onSubmit: handleFormSubmit,
  });

  const handleCaptionBlur = handleBlur('caption');

  const handleCaptionChange = handleChange('caption');

  const buttonDisabled =
    isSubmitting || !postFile || !isValid || thumbnailLoading; // Wait until we hacve fetched any performance that matches the artist and show dates before allow user to create post;

  let formErrorComponent: React.ReactNode | undefined;
  let createFileErrorComponent: React.ReactNode | undefined;

  // Validate the performer selection. TODO: Create some sort of selection form field which validates the selected input/value using a useEffect hook
  if (!performer) {
    formErrorComponent = (
      <AppError
        message="You must select an artist to create a post"
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
        retryText="Upload another video"
        onRetryAction={handleErrorActionPress}
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
        height: '100%',
        padding: APP_GUTTER,
      }}
    >
      <AppText
        weight="bold"
        size="large"
        textAlign="center"
        marginBottom={SPACING_XXSMALL}
      >
        Upload your video from the artist's show
      </AppText>
      <View
        style={{
          ...styles.flexRowContainer,
          ...styles.borederedContainer,
        }}
      >
        {!thumbnailLoading &&
          (thumbnailUri ? (
            <Image
              style={{ marginRight: SPACING_XXXSMALL }}
              source={{
                uri: thumbnailUri,
                width: 50,
                height: 50,
              }}
            ></Image>
          ) : (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: COLOR_NEUTRAL_XXLIGHT,
              }}
            >
              <SVGIcon
                height={40}
                width={40}
                color={IconColor.LIGHT}
              >
                <PictureSVG></PictureSVG>
              </SVGIcon>
            </View>
          ))}
        {thumbnailLoading && <LoadingThumbnail />}
        {/* Had to wrap in View to stop the AppTextInput overflowing width of the screen */}
        <View style={{ flex: 1 }}>
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
            backgroundColor="transparent"
            multiline={true}
          />
        </View>
      </View>

      <View
        style={{
          ...styles.flexColumnContainer,
          ...styles.borederedContainer,
        }}
      >
        {!performer && (
          <AppText
            isLink={true}
            handlePress={handlSearchForPerformerPress}
          >
            Select the artist
          </AppText>
        )}
        {performer && (
          <PerformerSearchCard
            performer={performer}
            onPress={handlSearchForPerformerPress}
          ></PerformerSearchCard>
        )}
      </View>
      {performer && (
        <>
          <View
            style={{
              ...styles.flexColumnContainer,
              ...styles.borederedContainer,
            }}
          >
            {performance && (
              <Pressable
                style={styles.flexRowContainer}
                onPress={handleSelectPerformancePress}
              >
                <SVGIcon
                  styles={{ marginRight: SPACING_SMALL }}
                  height={22}
                  width={22}
                  handlePress={handleSelectPerformancePress}
                >
                  <LocationSVG></LocationSVG>
                </SVGIcon>
                <AppText>
                  {`${performance.venueName} ${new Date(
                    performance.performanceDate * 1000,
                  ).toLocaleDateString()}`}
                </AppText>
              </Pressable>
            )}
            {!performance && (
              <AppText
                isLink={true}
                handlePress={handleSelectPerformancePress}
              >
                Select a performance
              </AppText>
            )}
          </View>
        </>
      )}

      <View
        style={{
          flexGrow: 1,
          justifyContent: 'flex-end',
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
              isSubmitting={isSubmitting}
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
    alignItems: 'stretch',
  },
  flexRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  borederedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: SPACING_XSMALL,
    paddingTop: SPACING_XSMALL,
  },
});
