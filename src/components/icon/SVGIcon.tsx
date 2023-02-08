import { iconColorGenerator } from 'components/icon/icon-utils';
import React, { FC } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Svg from 'react-native-svg';
import { IconColor, SVGProps } from './icon.types';

interface IconProps {
  children?: React.ReactElement<SVGProps>;
  color?: IconColor;
  handlePress?: (event?: GestureResponderEvent) => any;
  width?: number | string; // px
  height?: number | string; // px
  position?: 'absolute' | 'relative';
  inheritedStyles?: ViewStyle;
}

const DEFAULT_ICON_HEIGHT = 22;
const DEFAULT_ICON_WIDTH = 22;

/**
 * An SVG icon which scales to fit the size of its container.
 *
 * This is acheived by setting the view property to be the size of the raw/uploaded svg file, and then setting its height and width to 100% of its container
 */
export const SVGIcon: FC<IconProps> = ({
  color = IconColor.DARK,
  handlePress,
  inheritedStyles = {},
  width = DEFAULT_ICON_WIDTH,
  height = DEFAULT_ICON_HEIGHT,
  position = undefined,
  children,
}) => {
  const fill = iconColorGenerator(color);

  return (
    <Pressable
      style={{
        position,
        ...inheritedStyles,
        ...styles.iconContainer,
        width,
        height,
      }}
      onPress={e => (handlePress ? handlePress(e) : undefined)}
    >
      <Svg
        viewBox="0 0 22 22"
        height="100%"
        width="100%"
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </Svg>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    // // display: 'flex',
    // padding: 2,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
