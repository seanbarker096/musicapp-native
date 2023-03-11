import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { useFilesGetQuery } from 'store/files/files.queries';
import { SPACING_XXSMALL } from 'styles';

interface PostHeaderProps {
  avatarFileUuid?: string;
  username: string;
}

const UserPostHeader: FC<PostHeaderProps> = ({ avatarFileUuid, username }) => {
  const {
    isLoading: filesGetLoading,
    isError: isFilesGetError,
    data: files,
    error: filesGetError,
  } = useFilesGetQuery({
    queryParams: { uuid: avatarFileUuid },
  });

  const avatarFile = files && files[0];

  return (
    <>
      <ProfileImage
        size="small"
        styles={{ marginRight: SPACING_XXSMALL }}
        imageUrl={avatarFile?.url}
      ></ProfileImage>
      <AppText size="large">{username}</AppText>
    </>
  );
};

export default UserPostHeader;
