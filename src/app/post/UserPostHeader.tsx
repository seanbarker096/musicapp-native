import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { View } from 'react-native';
import { SPACING_XXSMALL } from 'styles';

interface PostHeaderProps {
  avatarImageUrl?: string;
  username: string;
  performanceText?: string;
}

const UserPostHeader: FC<PostHeaderProps> = ({
  avatarImageUrl,
  username,
  performanceText,
}) => {
  return (
    <>
      <ProfileImage
        size="small"
        styles={{ marginRight: SPACING_XXSMALL }}
        imageUrl={avatarImageUrl}
      ></ProfileImage>
      <View style={{ flexDirection: 'column' }}>
        <AppText size="large">{username}</AppText>
        <AppText size="small">{performanceText}</AppText>
      </View>
    </>
  );
};

export default UserPostHeader;
