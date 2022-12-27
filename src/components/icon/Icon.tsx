import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface IconProps {
  iconName: string;
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

const Icon: FC<IconProps> = ({
  iconName,
  width = DEFAULT_ICON_WIDTH,
  height = DEFAULT_ICON_HEIGHT,
}) => {
  return (
    <View style={styles.iconContainer}>
      <Image
        source={{
          uri: iconNames[iconName],
          width: width,
          height: height,
        }}
      ></Image>
    </View>
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

export default Icon;
