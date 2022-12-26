import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface IconProps {
  iconName: string;
}

const iconsRoot = 'assets/';

const Icon: FC<IconProps> = ({ iconName }) => (
  <View style={styles.iconContainer}>
    <Image source={require('assets/icon.png')}></Image>
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    display: 'flex',
    padding: '2px',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Icon;
