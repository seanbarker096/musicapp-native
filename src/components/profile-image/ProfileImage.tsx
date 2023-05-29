import React, { FC } from 'react';
import { Image, ImageStyle, Pressable, StyleSheet } from 'react-native';
import { profileImageSizeGenerator } from './profile-image.styles';
import { ProfileImageSize } from './profile-image.types';

interface ProfileImageProps {
  imageUrl?: string;
  size?: ProfileImageSize;
  styles?: ImageStyle;
  handlePress?: () => void;
}

const avatarImage = require('./../../assets/avatar.png');

export const ProfileImage: FC<ProfileImageProps> = ({
  imageUrl,
  styles = {},
  size = 'small',
  handlePress,
}) => {
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
};

const style = StyleSheet.create({});
