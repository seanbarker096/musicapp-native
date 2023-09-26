import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { FC, useContext } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { PostFile, UploadFileErrorType } from './create-post.types';

interface UploadFileProps {
  onFileSelected: (file: PostFile) => void;
  onCancel: (uploadFileErrorType?: UploadFileErrorType) => void;
}

export const UploadFile: FC<UploadFileProps> = ({
  onFileSelected,
  onCancel,
}) => {
  const { authState } = useContext(AuthStateContext);

  const userId = authState.authUser.userId;

  useFocusEffect(
    React.useCallback(() => {
      const _openMediaLibrary = async () => {
        const res = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (res.granted === false) {
          return onCancel(UploadFileErrorType.PERMISSION_DENIED);
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: false,
          quality: 1,
        });

        if (result.canceled) {
          return onCancel();
        }

        const file = await fetch(result.uri);

        const blob = await file.blob();

        if (blob && blob.type !== 'video/mp4' && blob.type !== 'video/webm') {
          return onCancel(UploadFileErrorType.FILE_TYPE);
        }

        return onFileSelected({
          imageInfo: result,
          mimeType: blob.type,
          fileName: `${userId}-post-${Date.now()}`,
          blob,
        });
      };

      _openMediaLibrary();

      return () => {};
    }, []),
  );

  return <></>;
};
