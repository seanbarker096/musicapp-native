import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { colorPrimary } from '../../../styles';

interface PrimaryNavProps {}

const PrimaryNav: FC<PrimaryNavProps> = () => (
  <View style={styles.navContainer}>Test</View>
);

const styles = StyleSheet.create({
  navContainer: {
    display: 'flex',
    backgroundColor: colorPrimary,
  },
});

export default PrimaryNav;
