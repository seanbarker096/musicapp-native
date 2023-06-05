import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
import { CreatePostForm } from './CreatePostForm';
import { UploadFile } from './UploadFile';
import { CreatePostStackScreenProps, PostFile } from './create-post.types';

export const CreatePost: FC<CreatePostStackScreenProps> = ({
  navigation,
  route: { params },
}) => {
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
          onSuccess={() => {
            // Replace so we can't nav back to this create post screen
            navigation.replace('ProfileStackScreen', {
              createPostSuccess: true,
            });
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
