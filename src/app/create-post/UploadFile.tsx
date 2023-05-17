import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { FC, useContext } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';

interface PostFile {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string | undefined;
  fileName: string | undefined;
  blob: Blob;
}

interface UploadFileProps {
  onFileSelected: (file: PostFile) => void;
  onCancel: () => void;
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
          onCancel();
        }

        if (!result.cancelled) {
          const file = await fetch(result.uri);

          const blob = await file.blob();

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
