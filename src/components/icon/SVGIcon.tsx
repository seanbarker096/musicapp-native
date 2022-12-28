import { iconColorGenerator } from 'components/icon/icon-utils';
import React, { FC } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import Svg from 'react-native-svg';
import { IconColor, SVGProps } from './icon.types';

interface IconProps {
  clickable?: boolean;
  children?: React.ReactElement<SVGProps>;
  color?: IconColor;
  width?: number; // px
  height?: number; // px
}

const iconNames: { [imageName: string]: string } = {
  'home-outline': require('assets/icons/home-outline.svg'),
  search: require('assets/icons/search.svg'),
  'bordered-plus': require('assets/icons/bordered-plus.svg'),
  people: require('assets/icons/people.svg'),
};

const DEFAULT_ICON_HEIGHT = 22;
const DEFAULT_ICON_WIDTH = 22;

const SVGIcon: FC<IconProps> = ({
  clickable = false,
  color = IconColor.DARK,
  width = DEFAULT_ICON_WIDTH,
  height = DEFAULT_ICON_HEIGHT,
  children,
}) => {
  const fill = iconColorGenerator(color);

  const icon = (
    <View style={styles.iconContainer}>
      <Svg
        width={width}
        height={height}
        fill={fill}
      >
        {children}
      </Svg>
    </View>
  );

  const handleIconPress = () => {
    console.log('pressed');
  };

  return (
    <>
      {clickable && (
        <TouchableHighlight onPress={handleIconPress}>
          {icon}
        </TouchableHighlight>
      )}
      {!clickable && icon}
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    display: 'flex',
    padding: '2px',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SVGIcon;
