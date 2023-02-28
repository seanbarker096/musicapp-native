import { useFocusEffect } from '@react-navigation/native';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { AppText } from 'components/app-text';
import ProfileImage from 'components/profile-image/ProfileImage';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React, { FC, useContext, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { usePostCreateMutation } from 'store/posts';
import { useUserGetQuery } from 'store/users';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXSMALL,
} from 'styles';
import { CreatePostStackScreenProps } from './post.types';

interface PostFile {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string | undefined;
  fileName: string | undefined;
  blob: Blob;
}

interface PostCreateFormValues {
  artistId: number | undefined;
  eventDate: string | undefined;
  eventName: string | undefined;
  caption: string | undefined;
}

export const CreatePost: FC<CreatePostStackScreenProps> = ({
  navigation,
}: CreatePostStackScreenProps) => {
  const [postFile, setPostFile] = useState<PostFile | undefined>(undefined);

  const { authState } = useContext(AuthStateContext);

  const userId = authState.authUser.userId;

  const { mutateAsync: createPost } = usePostCreateMutation({
    ownerId: userId,
  });

  const {
    mutateAsync: createFile,
    data: createdFile,
    isLoading: createFileLoading,
    isError: createFileError,
  } = useFileCreateMutation();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserGetError,
  } = useUserGetQuery({ id: userId });

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

    if (!form.artistId || !form.caption || !form.eventDate || !form.eventName) {
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
      content: form.caption,
      attachmentFileIds: [fileResult.file.id],
    });

    if (!postResult) {
      throw Error('failed to create post');
    }

    navigation.navigate(PrimaryScreens.PROFILE);
  };

  const handleCancelClick = function () {
    console.log('cancelled');
  };

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
            artistId: undefined,
            eventDate: undefined,
            eventName: '',
            caption: '',
          }}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
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
                  <Text>Event name</Text>
                  <TextInput
                    style={{
                      width: '100%',
                      display: 'flex',
                      ...styles.textInput,
                    }}
                    onChangeText={handleChange('eventName')}
                    onBlur={handleBlur('eventName')}
                    value={values.eventName}
                    placeholder="e.g. Travis Scott, O2 London"
                  />
                  <Text>Event date</Text>
                  <TextInput
                    style={{
                      display: 'flex',

                      ...styles.textInput,
                    }}
                    onChangeText={handleChange('eventDate')}
                    onBlur={handleBlur('eventDate')}
                    value={values.eventDate}
                    placeholder="Enter a date"
                  />
                </View>
              </View>
              <TextInput
                style={{ width: '100%', ...styles.textInput }}
                onChangeText={handleChange('caption')}
                onBlur={handleBlur('caption')}
                value={values.caption}
                placeholder="Write a caption..."
              />
              <Text style={{ width: '100%' }}>Artist</Text>
              <TextInput
                style={{ width: '100%', ...styles.textInput }}
                onChangeText={handleChange('artistId')}
                onBlur={handleBlur('artistId')}
                value={values.artistId}
                placeholder="e.g. Travis Scott"
              />
              <View
                style={{
                  ...styles.flexRowContainer,
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  width: '100%',
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
                    onPress={handleSubmit}
                    title="Share"
                  />
                </View>
              </View>
            </>
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
  },
  flexRowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInput: {},
});