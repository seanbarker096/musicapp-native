import React, { FC, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  TouchableNativeFeedbackProps,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  BORDER_COLOR_XDARK,
  BORDER_RADIUS_XSMALL,
  BORDER_RADIUS_XXSMALL,
} from 'styles';
import { AvatarSize } from './Avatar.types';

interface AvatarProps {
  imageUrl: string;
  size: AvatarSize.SMALL;
  onPress: <T>(arg: T) => void;
}

export const Avatar: FC<AvatarProps & TouchableNativeFeedbackProps> = ({
  imageUrl,
  size = AvatarSize.MEDIUM,
  onPress,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handlePress = (event: GestureResponderEvent) => {
    console.log(isActive);
    event.stopPropagation();
    setIsActive(!isActive);
    onPress(event);
  };

  return (
    <TouchableWithoutFeedback onPress={e => handlePress(e)}>
      <Image
        style={{
          borderRadius: size / 2,
          ...styles[isActive ? 'active' : 'inactive'],
        }}
        source={{ uri: imageUrl, height: `${size}px`, width: `${size}px` }}
      ></Image>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inactive: {
    borderStyle: 'solid',
    borderWidth: BORDER_RADIUS_XSMALL,
    borderColor: 'transparent',
  },
  active: {
    borderStyle: 'solid',
    borderWidth: BORDER_RADIUS_XXSMALL,
    borderColor: BORDER_COLOR_XDARK,
  },
});

export default Avatar;
