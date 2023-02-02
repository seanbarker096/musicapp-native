import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

interface GridProps {
  children: React.ReactNode | React.ReactNode[];
}

export const Grid: FC<GridProps> = ({ children }) => (
  <View style={styles.grid}>{children}</View>
);

const styles = StyleSheet.create({
  grid: {
    alignItems: 'flex-start',
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});
