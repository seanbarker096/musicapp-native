import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import * as ImagePicker from 'expo-image-picker';
import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { CreatePostForm } from './CreatePostForm';
import { UploadFile } from './UploadFile';
import { CreatePostStackScreenProps } from './create-post.types';

interface PostFile {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string | undefined;
  fileName: string | undefined;
  blob: Blob;
}

interface PostCreateFormValues {
  caption: string | undefined;
}

const createPostFormSchema = Yup.object({
  caption: Yup.string()
    .required('Required')
    .max(1000, 'Caption must be 1000 characters or less'),
});

interface CreatePostProps {
  postFile: PostFile;
}

export const CreatePost: FC<CreatePostStackScreenProps> = ({ navigation }) => {
  const [postFile, setPostFile] = useState<PostFile | undefined>(undefined);

  function handleCancel() {
    navigation.goBack();
  }

  return (
    <>
      <CreatePostForm
        postFile={postFile}
        onSuccess={() => navigation.navigate(PrimaryScreens.PROFILE)}
        onCancel={handleCancel}
        removePostFile={() => setPostFile(undefined)}
      ></CreatePostForm>
      {!postFile && (
        <UploadFile
          onFileSelected={setPostFile}
          onCancel={handleCancel}
        ></UploadFile>
      )}
    </>
  );
};

export default CreatePost;
