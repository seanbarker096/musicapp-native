import React, { FC, memo } from 'react';
import { Image, ImageStyle, Pressable } from 'react-native';
import { profileImageSizeGenerator } from './profile-image.styles';
import { ProfileImageSize } from './profile-image.types';

interface ProfileImageProps {
  imageUrl?: string;
  size?: ProfileImageSize;
  styles?: ImageStyle;
  handlePress?: () => void;
}

const avatarImage = require('./../../assets/avatar-v2.png');

export const ProfileImage: FC<ProfileImageProps> = memo(
  ({ imageUrl, styles = {}, size = 'small', handlePress }) => {
    const height = profileImageSizeGenerator(size);

    return (
      <Pressable onPress={handlePress}>
        <Image
          style={{ borderRadius: height / 2, height, width: height, ...styles }}
          source={
            imageUrl
              ? {
                  uri: imageUrl,
                  height,
                  width: height,
                }
              : avatarImage
          }
        ></Image>
      </Pressable>
    );
  },
);
