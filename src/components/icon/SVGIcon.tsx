import { iconColorGenerator } from 'components/icon/icon-utils';
import React, { FC } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg from 'react-native-svg';
import { IconColor, SVGProps } from './icon.types';

interface IconProps {
  children?: React.ReactElement<SVGProps>;
  color?: IconColor;
  handlePress?: (event?: GestureResponderEvent) => any;
  width?: number; // px
  height?: number; // px
}

const DEFAULT_ICON_HEIGHT = 22;
const DEFAULT_ICON_WIDTH = 22;

const SVGIcon: FC<IconProps> = ({
  color = IconColor.DARK,
  handlePress,
  width = DEFAULT_ICON_WIDTH,
  height = DEFAULT_ICON_HEIGHT,
  children,
}) => {
  const fill = iconColorGenerator(color);

  return (
    <Pressable onPress={e => (handlePress ? handlePress(e) : undefined)}>
      <View style={styles.iconContainer}>
        <Svg
          width={width}
          height={height}
          fill={fill}
        >
          {children}
        </Svg>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    display: 'flex',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SVGIcon;
