import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/SignUp';
import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import {
  CameraSVG,
  UserAvatarBorderedSVG,
} from 'components/icon/svg-components';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React, { FC, useState } from 'react';
import { Button, Image, StyleSheet, TextInput, View } from 'react-native';
import { useFileCreateMutation } from 'store/files/files.queries';
import { File } from 'store/files/files.types';
import { useUsersUpdateMutation } from 'store/users';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  COLOR_NEUTRAL_LIGHT,
  COLOR_NEUTRAL_XXXXLIGHT,
  SPACING_SMALL,
  SPACING_XXSMALL,
} from 'styles';
import { SignUpStackParamList } from './SignUpStackScreen';

interface ProfileImage {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string;
  fileName: string;
  blob: Blob;
}

type Props = NativeStackScreenProps<SignUpStackParamList, 'UploadProfileImage'>;

export const UploadProfileImage: FC<Props> = ({
  route: {
    params: { userId },
  },
  navigation: { navigate },
}) => {
  const { setAuthState, setLoggedOutPage } = React.useContext(
    SignUpPageStateSettersContext,
  );
  const [selectedImage, setSelectedImage] = useState<ProfileImage | undefined>(
    undefined,
  );

  const {
    mutateAsync: createFile,
    data: createdFile,
    isLoading: createFileLoading,
    isError: createFileError,
  } = useFileCreateMutation();

  const navigateToCreateBio = (userId: number) => {
    navigate('CreateBio', { userId: userId });
  };

  const {
    mutate,
    isLoading: updateUserLoading,
    error: updateUserError,
  } = useUsersUpdateMutation({
    userId,
    onSuccess: () => navigateToCreateBio(userId),
  });

  async function handleUploadPress() {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    const response = await ImagePicker.getMediaLibraryPermissionsAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.cancelled) {
      return;
    }

    if (!result.cancelled) {
      const file = await fetch(result.uri);

      const blob = await file.blob();

      setSelectedImage({
        imageInfo: result,
        mimeType: blob.type,
        fileName: `profile-image-${Date.now()}`,
        blob,
      });
    }
  }

  async function handleSubmit({
    firstName,
    secondName,
  }: {
    firstName: string;
    secondName: string;
  }) {
    // Upload file to file service
    let avatarImageFile: File | undefined = undefined;

    if (selectedImage) {
      const fileResult = await createFile({
        fileName: selectedImage.fileName,
        file: selectedImage.blob,
        mimeType: selectedImage.mimeType,
        uri: selectedImage.imageInfo.uri,
      });

      if (!fileResult) {
        throw Error('create file request failed');
      }
      // Get file uuid and update the users avatar_file_uuid property
      avatarImageFile = fileResult.file;
    }

    mutate({
      avatarFileUuid: avatarImageFile?.uuid,
      firstName,
      secondName,
    });
  }

  function handleSkip() {
    navigateToCreateBio(userId);
  }

  return (
    <View style={{ ...styles.flexColumnContainer, height: '100%' }}>
      <AppText>Upload Profile Picture</AppText>
      <View
        style={{
          position: 'relative',
        }}
      >
        <View
          style={{
            backgroundColor: COLOR_NEUTRAL_LIGHT,
            borderRadius: 50,
            overflow: 'hidden',
          }}
        >
          {selectedImage ? (
            <Image
              source={{
                uri: selectedImage?.imageInfo.uri,
                height: 100,
                width: 100,
              }}
            ></Image>
          ) : (
            <SVGIcon
              height={100}
              width={100}
            >
              <UserAvatarBorderedSVG></UserAvatarBorderedSVG>
            </SVGIcon>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40 / 2,
            width: 40,
            height: 40,
            backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
            position: 'absolute',
            bottom: -SPACING_XXSMALL,
            right: -SPACING_XXSMALL,
          }}
        >
          <SVGIcon
            color={IconColor.SECONDARY}
            handlePress={handleUploadPress}
          >
            <CameraSVG></CameraSVG>
          </SVGIcon>
        </View>
      </View>
      <Formik
        initialValues={{
          firstName: '',
          secondName: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View>
              <TextInput
                style={styles.text}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                placeholder="firstName"
              />
              <TextInput
                style={styles.text}
                onChangeText={handleChange('secondName')}
                onBlur={handleBlur('secondName')}
                value={values.secondName}
                placeholder="secondName"
              />
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
                  onPress={handleSkip}
                  title="Skip"
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
                  disabled={!selectedImage}
                  onPress={handleSubmit}
                  title="Submit"
                ></Button>
              </View>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  flexColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexRowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInput: {},
  text: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
