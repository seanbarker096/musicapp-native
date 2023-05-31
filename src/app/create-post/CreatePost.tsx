import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
import { CreatePostForm } from './CreatePostForm';
import { UploadFile } from './UploadFile';
import { CreatePostStackScreenProps, PostFile } from './create-post.types';

export const CreatePost: FC<CreatePostStackScreenProps> = ({ navigation }) => {
  const [postFile, setPostFile] = useState<PostFile | undefined>(undefined);

  const { profileState } = useContext(ProfileContext);

  function handleCancel() {
    navigation.goBack();
  }

  return (
    <>
      {/* Only users can create posts */}
      {postFile && profileState.profileType === ProfileType.USER && (
        <CreatePostForm
          postFile={postFile}
          onSuccess={() => navigation.navigate(PrimaryScreens.PROFILE)}
          onCancel={handleCancel}
          removePostFile={() => setPostFile(undefined)}
        ></CreatePostForm>
      )}
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
