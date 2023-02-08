import React, { FC } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { profileImageSizeGenerator } from './profile-image.styles';
import { ProfileImageSize } from './profile-image.types';

interface ProfileImageProps {
  imageUrl?: string;
  size?: ProfileImageSize;
  styles: ViewStyle;
}

const avatarImage = require('./../../assets/avatar.png');

const ProfileImage: FC<ProfileImageProps> = ({
  imageUrl,
  styles,
  size = 'small',
}) => {
  const height = profileImageSizeGenerator(size);

  return (
    <View style={{ ...styles, height: height, width: height }}>
      <Image
        style={{ ...style.image }}
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
    </View>
  );
};

const style = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});

export default ProfileImage;
