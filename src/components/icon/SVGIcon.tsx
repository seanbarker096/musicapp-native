import React, { FC } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { SVGProps } from './icon.types';

interface IconProps {
  clickable?: boolean;
  children?: React.ReactElement<SVGProps>;
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
  width = DEFAULT_ICON_WIDTH,
  height = DEFAULT_ICON_HEIGHT,
  children,
}) => {
  const icon = <View style={styles.iconContainer}>{children}</View>;

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
