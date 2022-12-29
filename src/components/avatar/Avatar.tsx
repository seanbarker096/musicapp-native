import React, { FC } from 'react';
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleProp,
  TouchableNativeFeedbackProps,
} from 'react-native';
import { AvatarSize } from './Avatar.types';

interface AvatarProps {
  handlePress?: (event?: GestureResponderEvent) => any;
  imageUrl: string;
  size: AvatarSize.SMALL;
  style: StyleProp<any>;
}

export const Avatar: FC<AvatarProps & TouchableNativeFeedbackProps> = ({
  handlePress,
  imageUrl,
  size = AvatarSize.MEDIUM,
  style,
}) => {
  return (
    <Pressable onPress={e => (handlePress ? handlePress(e) : undefined)}>
      <Image
        style={{ ...style }}
        source={{ uri: imageUrl, height: `${size}px`, width: `${size}px` }}
      ></Image>
    </Pressable>
  );
};

export default Avatar;
