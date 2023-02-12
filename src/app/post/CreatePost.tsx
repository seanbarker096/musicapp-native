import { useFocusEffect } from '@react-navigation/native';
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
import { useFilesGetQuery } from 'store/files/files.queries';
import { usePostCreateMutation } from 'store/posts';
import { useUserGetQuery } from 'store/users';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXSMALL,
} from 'styles';

interface CreatePostProps {}

export const CreatePost: FC<CreatePostProps> = () => {
  const [postFile, setPostFile] = useState<ImagePicker.ImageInfo | undefined>(
    undefined,
  );

  const { authState } = useContext(AuthStateContext);

  const userId = authState.authUser.userId;

  const { mutate: createPost } = usePostCreateMutation({ ownerId: userId });

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
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.cancelled) {
          const regexArray = result.uri.match(/\.[0-9a-z]+$/i);
          const extension = regexArray ? regexArray[0] : undefined;
          setPostFile(result);
        }
      };

      _openMediaLibrary();

      return () => {
        setPostFile(undefined);
      };
    }, []),
  );

  const handleFormSubmit = function (form: any) {
    // first upload the files

    // then create the post
    createPost({
      ownerId: form.ownerId,
      content: form.caption,
      attachmentFileIds: [],
    });
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
                  source={{ uri: postFile?.uri, width: 150, height: 150 }}
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
