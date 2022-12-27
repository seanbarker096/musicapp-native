import React, { FC } from 'react';
import { Image, StyleSheet } from 'react-native';
import AvatarSize from './Avatar.types';

interface AvatarProps {
  imageUrl: string;
  size: AvatarSize.SMALL;
}

const Avatar: FC<AvatarProps> = ({ imageUrl, size }) => {
  return (
    <Image
      style={{ borderRadius: size / 2 }}
      source={{ uri: imageUrl, height: `${size}px`, width: `${size}px` }}
    ></Image>
  );
};

const styles = StyleSheet.create({});

export default Avatar;
