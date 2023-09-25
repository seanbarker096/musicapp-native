import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/logged-out-page.contexts';
import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';
import { IconColor, SVGIcon } from 'components/icon';
import { PlusSVG } from 'components/icon/svg-components';
import { ProfileImage } from 'components/profile-image';
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useFileCreateMutation } from 'store/files/files.queries';
import { File } from 'store/files/files.types';
import { useUsersUpdateMutation } from 'store/users';
import {
  APP_GUTTER,
  BUTTON_COLOR_PRIMARY,
  COLOR_NEUTRAL_LIGHT,
  COLOR_NEUTRAL_XXXXLIGHT,
  SPACING_MID,
  SPACING_NONE,
} from 'styles';
import * as Yup from 'yup';
import { SignUpStackParamList } from './sign-up.types';

interface ProfileImage {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string;
  fileName: string;
  blob: Blob;
}

type Props = NativeStackScreenProps<SignUpStackParamList, 'UploadProfileImage'>;

const formSchema = Yup.object({
  firstName: Yup.string()
    .required('Required')
    .min(2, 'Must be at least 2 characters'),
  secondName: Yup.string()
    .required('Required')
    .min(2, 'Must be at least 2 characters'),
});

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
    mutateAsync: updateUser,
    isLoading: updateUserLoading,
    error: updateUserError,
  } = useUsersUpdateMutation({
    userId,
    onSuccess: () => navigateToCreateBio(userId),
  });

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
    validationSchema: formSchema,
    initialValues: { firstName: '', secondName: '' },
    onSubmit: onFormSubmit,
  });

  const buttonDisabled = isSubmitting || !isValid || !dirty;

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

  async function onFormSubmit({
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

    return updateUser({
      avatarFileUuid: avatarImageFile?.uuid,
      firstName,
      secondName,
    });
  }

  function handleSkip() {
    navigateToCreateBio(userId);
  }

  return (
    <View
      style={{
        ...styles.flexColumnContainer,
        height: '100%',
        padding: APP_GUTTER,
        paddingTop: '25%',
      }}
    >
      <AppText
        size="large"
        marginBottom={SPACING_MID}
      >
        Enter your name, and upload a profile image
      </AppText>
      <View
        style={{
          position: 'relative',
          marginBottom: SPACING_MID,
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
            <ProfileImage size="xlarge" />
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30 / 2,
            width: 30,
            height: 30,
            backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
            position: 'absolute',
            bottom: -1,
            right: -1,
          }}
        >
          <SVGIcon
            color={IconColor.SECONDARY}
            handlePress={handleUploadPress}
          >
            <PlusSVG></PlusSVG>
          </SVGIcon>
        </View>
      </View>
      <View style={{ width: '80%' }}>
        <AppTextInput
          handleChange={handleChange('firstName')}
          handleBlur={handleBlur('firstName')}
          value={values.firstName}
          value={values.firstName}
          placeholder="First name"
          error={errors.firstName}
          touched={touched.firstName}
          borderless={false}
        />
        <AppTextInput
          handleChange={handleChange('secondName')}
          handleBlur={handleBlur('secondName')}
          value={values.secondName}
          value={values.secondName}
          placeholder="Second name"
          error={errors.secondName}
          touched={touched.secondName}
          borderless={false}
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
          }}
        >
          <AppButton
            color={BUTTON_COLOR_PRIMARY}
            disabled={buttonDisabled}
            text="Next"
            handlePress={handleSubmit}
            isSubmitting={isSubmitting}
            marginBottom={SPACING_NONE}
          ></AppButton>
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
