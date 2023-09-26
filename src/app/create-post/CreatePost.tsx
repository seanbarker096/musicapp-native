import { CommonActions } from '@react-navigation/native';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { AppError } from 'components/app-error';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
import { View } from 'react-native';
import { SPACING_SMALL } from 'styles';
import { CreatePostForm } from './CreatePostForm';
import { UploadFile } from './UploadFile';
import {
  CreatePostStackScreenProps,
  PostFile,
  UploadFileErrorType,
} from './create-post.types';

export const CreatePost: FC<CreatePostStackScreenProps> = ({
  navigation,
  route: { params },
}) => {
  const [postFile, setPostFile] = useState<PostFile | undefined>(undefined);
  const [uploadFileError, setUploadFileError] = useState<
    UploadFileErrorType | undefined
  >(undefined);

  const { profileState } = useContext(ProfileContext);

  function handleCancel(
    uploadFileError: UploadFileErrorType | undefined = undefined,
  ) {
    if (uploadFileError) {
      setUploadFileError(uploadFileError);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Only users can create posts */}
      {!uploadFileError &&
        postFile &&
        profileState.profileType === ProfileType.USER && (
          <CreatePostForm
            postFile={postFile}
            onSuccess={() => {
              // Replace so we can't nav back to this create post screen
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: PrimaryScreens.PROFILE,
                      params: { createPostSuccess: true },
                    },
                  ],
                }),
              );
            }}
            onCancel={handleCancel}
            removePostFile={() => setPostFile(undefined)}
            performer={params?.performer}
            performance={params?.performance}
            handlSearchForPerformerPress={() =>
              navigation.navigate('CreatePostPerformerSearch')
            }
            handleSelectPerformancePress={
              () =>
                params?.performer
                  ? navigation.navigate('CreatePostPerformanceSearch', {
                      performer: params?.performer,
                    })
                  : undefined // Shouldn't happen, but if performer not defined then just dont navigate away from CreatePostForm
            }
          ></CreatePostForm>
        )}
      {uploadFileError && uploadFileError === UploadFileErrorType.FILE_TYPE && (
        <AppError
          message="You can only upload mp4 or webm videos"
          marginBottom={SPACING_SMALL}
        ></AppError>
      )}
      {uploadFileError &&
        uploadFileError === UploadFileErrorType.PERMISSION_DENIED && (
          <AppError
            message="You must allow Gigstory access to your camera roll to upload a video. You can do this in your device settings"
            marginBottom={SPACING_SMALL}
          ></AppError>
        )}
      {!postFile && (
        <UploadFile
          onFileSelected={setPostFile}
          onCancel={handleCancel}
        ></UploadFile>
      )}
    </View>
  );
};

export default CreatePost;
