import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useFilesGetQuery } from 'store/files/files.queries';
import { SPACING_XXSMALL } from 'styles';

interface PostHeaderProps {
  avatarFileUuid?: string;
  username: string;
  performanceText?: string;
}

const UserPostHeader: FC<PostHeaderProps> = ({
  avatarFileUuid,
  username,
  performanceText,
}) => {
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
      <View style={{ flexDirection: 'column' }}>
        <AppText size="large">{username}</AppText>
        <AppText size="small">{performanceText}</AppText>
      </View>
    </>
  );
};

export default UserPostHeader;
