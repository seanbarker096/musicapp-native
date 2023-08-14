import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { FC, useContext } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { PostFile } from './create-post.types';


interface UploadFileProps {
  onFileSelected: (file: PostFile) => void;
  onCancel: (fileTypeError: boolean) => void;
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
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        const response = await ImagePicker.getMediaLibraryPermissionsAsync();

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: false,
          quality: 1,
        });

        if (result.cancelled) {
          onCancel(false);
        }

        if (!result.cancelled) {
          const file = await fetch(result.uri);

          const blob = await file.blob();

          if (blob.type !== 'video/mp4' && blob.type !== 'video/webm') {
            onCancel(true);
          }

          onFileSelected({
            imageInfo: result,
            mimeType: blob.type,
            fileName: `${userId}-post-${Date.now()}`,
            blob,
          });
        }
      };

      _openMediaLibrary();

      return () => {};
    }, []),
  );

  return <></>;
};
