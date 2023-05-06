import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoggedOutPage } from 'app/App';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/SignUp';
import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { CameraSVG } from 'components/icon/svg-components';
import * as ImagePicker from 'expo-image-picker';
import React, { FC, useState } from 'react';
import { Button, Image } from 'react-native';
import { AuthStatus, AuthUserRole } from 'store/auth/auth.types';
import { useFileCreateMutation } from 'store/files/files.queries';
import { useUsersUpdateMutation } from 'store/users';
import { User } from 'store/users/users.types';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
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

const avatarImage = require('./../assets/avatar.png');

export const UploadProfileImage: FC<Props> = ({
  route: {
    params: { userId },
  },
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

  const {
    mutate,
    isLoading: updateUserLoading,
    error: updateUserError,
  } = useUsersUpdateMutation({
    userId,
    onSuccess: (user: User) => {
      // Set auth state to logged in once we set the users profile picture
      setAuthState({
        status: AuthStatus.AUTHENTICATED,
        authUser: {
          userId: user.id,
          role: AuthUserRole.USER,
        },
      });
    },
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

  async function handleSubmit(selectedImage: ProfileImage) {
    // Upload file to file service
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
    const avatarImageFile = fileResult.file;

    mutate({
      avatarFileUuid: avatarImageFile.uuid,
    });
  }

  function handleSkip() {
    // Set auth state to logged in provided user was created successfully in main sign up screen
    setAuthState({
      status: AuthStatus.AUTHENTICATED,
      authUser: {
        userId,
        role: AuthUserRole.USER,
      },
    });

    setLoggedOutPage(LoggedOutPage.LOGIN);
  }

  return (
    <>
      <AppText>Upload Profile Picture</AppText>
      <Image
        style={{ position: 'relative' }}
        source={
          selectedImage
            ? {
                uri: selectedImage?.imageInfo.uri,
                height: 150,
                width: 150,
              }
            : avatarImage
        }
      ></Image>
      <SVGIcon
        styles={{
          position: 'absolute',
          right: -SPACING_XXSMALL,
          bottom: -SPACING_XXSMALL,
        }}
        handlePress={handleUploadPress}
      >
        <CameraSVG></CameraSVG>
      </SVGIcon>
      <Button
        color={BUTTON_COLOR_PRIMARY}
        disabled={!!selectedImage}
        onPress={() => handleSubmit(selectedImage as ProfileImage)}
        title="Submit"
      ></Button>
      <Button
        color={BUTTON_COLOR_DISABLED}
        onPress={handleSkip}
        title="Skip"
      ></Button>
    </>
  );
};
